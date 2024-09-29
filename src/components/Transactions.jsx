import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useSendSms,
  useMakeVoiceCall,
  useConsumeInternet,
  useAllUsers,
  useGetAllTransactions,
} from '../api/hooks';
import { useSnackbar } from 'notistack';
import VoiceCallTimer from './VoiceCallTimer';

// Validation Schemas
const smsSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  receiver: z.string().min(1, 'Receiver is required'),
  content: z.string().min(1, 'Content is required'),
});

const callSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  receiver: z.string().min(1, 'Receiver is required'),
});

const internetSchema = z.object({
  consumer: z.string().min(1, 'Consumer is required'),
  dataSize: z.number().min(1, 'Data size must be at least 1 MB'),
});

// Reusable Transaction Form
const TransactionForm = ({ title, schema, onSubmit, fields, users, isLoading, submitLabel }) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const { enqueueSnackbar } = useSnackbar();

  const onSubmitWrapper = async (data) => {
    try {
      await onSubmit(data);
      reset();
      enqueueSnackbar('Transaction successful', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Transaction failed', { variant: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmitWrapper)}>
        {fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            defaultValue=""
            render={({ field: inputField, fieldState: { error } }) =>
              field.type === 'select' ? (
                <FormControl fullWidth margin="normal" error={!!error}>
                  <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                  <Select
                    {...inputField}
                    labelId={`${field.name}-label`}
                    label={field.label}
                    disabled={isLoading}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.msisdn} value={user.msisdn}>
                        {user.name} ({user.msisdn})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  {...inputField}
                  label={field.label}
                  type={field.type || 'text'}
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  disabled={isLoading}
                />
              )
            }
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : submitLabel || 'Submit'}
        </Button>
      </form>
    </Paper>
  );
};

const Transactions = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: usersResponse, isLoading: isLoadingUsers } = useAllUsers();
  const { data: transactions, isLoading: isLoadingTransactions, error } = useGetAllTransactions(); // Fetch all transactions
  const sendSmsMutation = useSendSms();
  const makeVoiceCallMutation = useMakeVoiceCall();
  const consumeInternetMutation = useConsumeInternet();

  const [isCallSetup, setIsCallSetup] = useState(false);
  const [callSender, setCallSender] = useState('');
  const [callReceiver, setCallReceiver] = useState('');

  const users = usersResponse?.[0]?.data || [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onSendSms = async (data) => {
    await sendSmsMutation.mutateAsync(data);
  };

  const onSetupVoiceCall = async (data) => {
    const sender = users.find((user) => user.msisdn === data.sender);
    if (sender.balance <= 0) {
      enqueueSnackbar('Insufficient balance to make a call', { variant: 'error' });
      return;
    }
    setCallSender(data.sender);
    setCallReceiver(data.receiver);
    setIsCallSetup(true);
  };

  const onCallEnd = async (duration) => {
    try {
      await makeVoiceCallMutation.mutateAsync({ sender: callSender, receiver: callReceiver, duration });
      setIsCallSetup(false);
      enqueueSnackbar('Call ended successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to end call', { variant: 'error' });
    }
  };

  const onInsufficientBalance = () => {
    enqueueSnackbar('Insufficient balance to continue the call', { variant: 'error' });
    setIsCallSetup(false);
  };

  const onConsumeInternet = async (data) => {
    await consumeInternetMutation.mutateAsync(data);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderServiceTypeBadge = (serviceType) => {
    let color;
    switch (serviceType) {
      case 'SMS':
        color = 'primary';
        break;
      case 'Voice Call':
        color = 'secondary';
        break;
      case 'Internet':
        color = 'success';
        break;
      default:
        color = 'default';
        break;
    }
    return <Chip label={serviceType} color={color} />;
  };

  if (isLoadingUsers) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <Grid container spacing={3}>
        {/* Existing forms */}
        <Grid item xs={12} md={4}>
          <TransactionForm
            title="Send SMS"
            schema={smsSchema}
            onSubmit={onSendSms}
            fields={[
              { name: 'sender', label: 'Sender', type: 'select' },
              { name: 'receiver', label: 'Receiver', type: 'select' },
              { name: 'content', label: 'Content', type: 'text' },
            ]}
            users={users}
            isLoading={sendSmsMutation.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {!isCallSetup ? (
            <TransactionForm
              title="Make Voice Call"
              schema={callSchema}
              onSubmit={onSetupVoiceCall}
              fields={[
                { name: 'sender', label: 'Sender', type: 'select' },
                { name: 'receiver', label: 'Receiver', type: 'select' },
              ]}
              users={users}
              isLoading={makeVoiceCallMutation.isLoading}
              submitLabel="Continue"
            />
          ) : (
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Make Voice Call
              </Typography>
              <VoiceCallTimer
                sender={callSender}
                receiver={callReceiver}
                onCallEnd={onCallEnd}
                isLoading={makeVoiceCallMutation.isLoading}
                onInsufficientBalance={onInsufficientBalance}
              />
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <TransactionForm
            title="Consume Internet"
            schema={internetSchema}
            onSubmit={onConsumeInternet}
            fields={[
              { name: 'consumer', label: 'Consumer', type: 'select' },
              { name: 'dataSize', label: 'Data Size (MB)', type: 'number' },
            ]}
            users={users}
            isLoading={consumeInternetMutation.isLoading}
          />
        </Grid>
      </Grid>

      {/* Transaction Table with Pagination */}
      <Box mt={4}>
        <Typography variant="h4" gutterBottom marginTop={12}>
          All Transactions
        </Typography>
        {isLoadingTransactions ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error.message}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Sender</TableCell>
                  <TableCell>Receiver</TableCell>
                  <TableCell>Service Type</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Amount</TableCell>
                  {/* <TableCell>Miner Fee</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.sender}</TableCell>
                      <TableCell>{transaction.receiver}</TableCell>
                      <TableCell>{renderServiceTypeBadge(transaction.serviceType)}</TableCell>
                      <TableCell>{transaction.content}</TableCell>
                      <TableCell>{transaction.timestamp}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      {/* <TableCell>{transaction.minerFee}</TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Transactions;
