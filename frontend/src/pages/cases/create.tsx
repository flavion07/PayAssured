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
  Typography,
} from '@mui/material';
import { Layout } from '@/components/Layout';
import { casesAPI, clientsAPI } from '@/services/api';
import { Client, CreateCasePayload } from '@/types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  client_id: yup.number().required('Client is required').typeError('Client is required'),
  invoice_number: yup
    .string()
    .required('Invoice number is required')
    .min(1, 'Invoice number is required'),
  invoice_date: yup.string().required('Invoice date is required'),
  due_date: yup.string().required('Due date is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .typeError('Amount must be a number'),
  follow_up_notes: yup.string().optional(),
});

export default function CreateCase() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      client_id: 0,
      invoice_number: '',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: '',
      amount: 0,
      follow_up_notes: '',
    },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientsAPI.list(0, 100);
        setClients(data);
      } catch (error) {
        enqueueSnackbar('Failed to load clients', { variant: 'error' });
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [enqueueSnackbar]);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      const payload: CreateCasePayload = {
        client_id: parseInt(data.client_id),
        invoice_number: data.invoice_number,
        invoice_date: new Date(data.invoice_date).toISOString(),
        due_date: new Date(data.due_date).toISOString(),
        amount: data.amount.toString(),
        follow_up_notes: data.follow_up_notes || undefined,
      };

      await casesAPI.create(payload);
      enqueueSnackbar('Case created successfully', { variant: 'success' });
      router.push('/cases');
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.detail || 'Failed to create case',
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingClients) {
    return (
      <Layout title="Create Case">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Create Case">
      <Card>
        <CardHeader title="Create New Case" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Client Selection */}
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.client_id}>
                    <InputLabel>Client</InputLabel>
                    <Select
                      {...field}
                      label="Client"
                    >
                      <MenuItem value="">Select a client</MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.client_id && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                        {errors.client_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              {/* Invoice Number */}
              <Controller
                name="invoice_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Invoice Number"
                    fullWidth
                    error={!!errors.invoice_number}
                    helperText={errors.invoice_number?.message}
                    placeholder="INV-001"
                  />
                )}
              />

              {/* Invoice Date */}
              <Controller
                name="invoice_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Invoice Date"
                    type="date"
                    fullWidth
                    error={!!errors.invoice_date}
                    helperText={errors.invoice_date?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              {/* Due Date */}
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    fullWidth
                    error={!!errors.due_date}
                    helperText={errors.due_date?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              {/* Amount */}
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount (₹)"
                    fullWidth
                    type="number"
                    inputProps={{ step: '0.01', min: '0' }}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    placeholder="0.00"
                  />
                )}
              />

              {/* Follow-up Notes */}
              <Controller
                name="follow_up_notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Follow-up Notes"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.follow_up_notes}
                    helperText={errors.follow_up_notes?.message}
                    placeholder="Add any additional notes..."
                  />
                )}
              />

              {/* Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push('/cases')}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Case'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
