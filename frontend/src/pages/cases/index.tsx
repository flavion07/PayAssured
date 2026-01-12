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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import { Layout } from '@/components/Layout';
import { StatusBadge, EmptyState } from '@/components';
import { casesAPI, clientsAPI } from '@/services/api';
import { Case, Client, CaseStatus } from '@/types';
import { useSnackbar } from 'notistack';
import { formatDate, formatCurrency } from '@/utils/format';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';

const CaseStatuses: CaseStatus[] = ['New', 'In Follow-up', 'Partially Paid', 'Closed'];

export default function CasesList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<{ [key: number]: Client }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchData();
  }, [statusFilter, sortBy, order]);

  useEffect(() => {
    // Filter cases based on search query
    const filtered = cases.filter((caseItem) => {
      const client = clients[caseItem.client_id];
      const searchLower = searchQuery.toLowerCase();
      return (
        caseItem.invoice_number.toLowerCase().includes(searchLower) ||
        client?.name?.toLowerCase().includes(searchLower) ||
        caseItem.status.toLowerCase().includes(searchLower)
      );
    });
    setFilteredCases(filtered);
  }, [searchQuery, cases, clients]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [caseData, clientData] = await Promise.all([
        casesAPI.list(0, 100, statusFilter || undefined, sortBy, order),
        clientsAPI.list(0, 100),
      ]);

      setCases(caseData);
      const clientMap = clientData.reduce(
        (acc, client) => ({ ...acc, [client.id]: client }),
        {}
      );
      setClients(clientMap);
    } catch (error) {
      enqueueSnackbar('Failed to load cases', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await casesAPI.delete(id);
        enqueueSnackbar('Case deleted successfully', { variant: 'success' });
        fetchData();
      } catch (error) {
        enqueueSnackbar('Failed to delete case', { variant: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Cases">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Cases">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FilterListIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Cases
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage and track all invoice cases
            </Typography>
          </Box>
          <Link href="/cases/create" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              New Case
            </Button>
          </Link>
        </Box>

        {/* Search and Filters */}
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0EA5E910 0%, #22C55E10 100%)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <TextField
            placeholder="Search cases, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              minWidth: 250,
              flex: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {CaseStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as any)}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="created_at">Created Date</MenuItem>
              <MenuItem value="due_date">Due Date</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={order}
              label="Order"
              onChange={(e) => setOrder(e.target.value as any)}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="desc">Newest</MenuItem>
              <MenuItem value="asc">Oldest</MenuItem>
            </Select>
          </FormControl>

          <Chip
            label={`${filteredCases.length} results`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Paper>
      </Box>

      {/* Table */}
      {filteredCases.length === 0 ? (
        <Card>
          <EmptyState 
            message={searchQuery ? 'No cases match your search' : 'No cases found'} 
            isSearch={!!searchQuery}
          />
        </Card>
      ) : (
        <Card sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  {!isMobile && <TableCell>Client</TableCell>}
                  {!isMobile && <TableCell>Amount</TableCell>}
                  {!isMobile && <TableCell>Due Date</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F8FAFC',
                        cursor: 'pointer',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {caseItem.invoice_number}
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontWeight: 500 }}>
                        {clients[caseItem.client_id]?.name || 'Unknown'}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(caseItem.amount)}</TableCell>
                    )}
                    {!isMobile && <TableCell>{formatDate(caseItem.due_date)}</TableCell>}
                    <TableCell>
                      <StatusBadge status={caseItem.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Link href={`/cases/${caseItem.id}`} style={{ textDecoration: 'none' }}>
                          <IconButton
                            size="small"
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                              },
                            }}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                        <IconButton
                          size="small"
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'white',
                            },
                          }}
                          onClick={() => handleDelete(caseItem.id)}
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
    </Layout>
  );
}
