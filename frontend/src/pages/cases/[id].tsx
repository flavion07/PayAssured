import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Grid,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components';
import { casesAPI, clientsAPI } from '@/services/api';
import { Case, Client, CaseStatus, UpdateCasePayload } from '@/types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { formatDate, formatCurrency, formatDateTime } from '@/utils/format';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const CaseStatuses: CaseStatus[] = ['New', 'In Follow-up', 'Partially Paid', 'Closed'];

export default function CaseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<CaseStatus | ''>('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      const caseItem = await casesAPI.get(parseInt(id as string));
      setCaseData(caseItem);
      setStatus(caseItem.status);
      setFollowUpNotes(caseItem.follow_up_notes || '');

      const clientData = await clientsAPI.get(caseItem.client_id);
      setClient(clientData);
    } catch (error) {
      enqueueSnackbar('Failed to load case details', { variant: 'error' });
      router.push('/cases');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const payload: UpdateCasePayload = {
        status: status as CaseStatus,
        follow_up_notes: followUpNotes || undefined,
      };

      const updated = await casesAPI.update(parseInt(id as string), payload);
      setCaseData(updated);
      setEditing(false);
      enqueueSnackbar('Case updated successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.detail || 'Failed to update case',
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await casesAPI.delete(parseInt(id as string));
      enqueueSnackbar('Case deleted successfully', { variant: 'success' });
      router.push('/cases');
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.detail || 'Failed to delete case',
        { variant: 'error' }
      );
    }
  };

  if (loading) {
    return (
      <Layout title="Case Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout title="Case Details">
        <Card>
          <CardContent>
            <Typography color="error">Case not found</Typography>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Case Details">
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/cases')}
        >
          Back
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {caseData.invoice_number}
        </Typography>
        <StatusBadge status={caseData.status} size="medium" />
      </Stack>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Case Information"
              action={
                !editing && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                )
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                {/* Client */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    CLIENT
                  </Typography>
                  <Typography variant="body1">{client?.name}</Typography>
                  {client?.email && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {client.email}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Invoice Details */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      INVOICE DATE
                    </Typography>
                    <Typography variant="body1">{formatDate(caseData.invoice_date)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      DUE DATE
                    </Typography>
                    <Typography variant="body1">{formatDate(caseData.due_date)}</Typography>
                  </Grid>
                </Grid>

                <Divider />

                {/* Amount */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    AMOUNT
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(caseData.amount)}
                  </Typography>
                </Box>

                <Divider />

                {/* Status and Notes - Editable */}
                {editing && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value as CaseStatus)}
                      >
                        {CaseStatuses.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Follow-up Notes"
                      multiline
                      rows={6}
                      fullWidth
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      placeholder="Add any follow-up notes..."
                    />

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditing(false);
                          setStatus(caseData.status);
                          setFollowUpNotes(caseData.follow_up_notes || '');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={submitting}
                      >
                        {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
                      </Button>
                    </Stack>
                  </>
                )}

                {!editing && (
                  <>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        STATUS
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <StatusBadge status={caseData.status} size="medium" />
                      </Box>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        FOLLOW-UP NOTES
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: 'pre-wrap',
                          color: caseData.follow_up_notes ? 'text.primary' : 'text.disabled',
                        }}
                      >
                        {caseData.follow_up_notes || 'No notes added yet'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Details" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    CREATED AT
                  </Typography>
                  <Typography variant="body2">{formatDateTime(caseData.created_at)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    LAST UPDATED
                  </Typography>
                  <Typography variant="body2">{formatDateTime(caseData.updated_at)}</Typography>
                </Box>

                <Divider />

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  fullWidth
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Case
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Case</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete case {caseData.invoice_number}? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDelete();
            }}
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
