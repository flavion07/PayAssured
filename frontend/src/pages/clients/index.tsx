import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Layout } from '@/components/Layout';
import { EmptyState } from '@/components';
import { clientsAPI } from '@/services/api';
import { Client } from '@/types';
import { useSnackbar } from 'notistack';
import { formatDate } from '@/utils/format';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(1, 'Name is required'),
  email: yup.string().email('Invalid email').optional(),
  phone: yup.string().optional(),
  company: yup.string().optional(),
});

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.list(0, 100);
      setClients(data);
    } catch (error) {
      enqueueSnackbar('Failed to load clients', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, data);
        enqueueSnackbar('Client updated successfully', { variant: 'success' });
      } else {
        await clientsAPI.create(data);
        enqueueSnackbar('Client created successfully', { variant: 'success' });
      }
      setDialogOpen(false);
      setEditingClient(null);
      reset();
      fetchClients();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.detail || 'Failed to save client',
        { variant: 'error' }
      );
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setValue('name', client.name);
    setValue('email', client.email || '');
    setValue('phone', client.phone || '');
    setValue('company', client.company || '');
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingClientId) return;

    try {
      await clientsAPI.delete(deletingClientId);
      enqueueSnackbar('Client deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setDeletingClientId(null);
      fetchClients();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.detail || 'Failed to delete client',
        { variant: 'error' }
      );
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingClient(null);
    reset();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout title="Clients">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Clients">
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          New Client
        </Button>
      </Box>

      {/* Table */}
      {clients.length === 0 ? (
        <Card>
          <EmptyState message="No clients found" />
        </Card>
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>}
                  {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>}
                  {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>}
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{client.name}</TableCell>
                    {!isMobile && <TableCell>{client.email || '-'}</TableCell>}
                    {!isMobile && <TableCell>{client.company || '-'}</TableCell>}
                    {!isMobile && <TableCell>{formatDate(client.created_at)}</TableCell>}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(client)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingClientId(client.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClient ? 'Edit Client' : 'Create New Client'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />

            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company"
                  fullWidth
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingClient ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this client? This action will also delete all associated
          cases.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
