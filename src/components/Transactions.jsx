import React from 'react';
import { Typography, Grid, Paper, TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSendSms, useMakeVoiceCall, useConsumeInternet, useAllUsers } from '../api/hooks';
import { useSnackbar } from 'notistack';

const smsSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  receiver: z.string().min(1, 'Receiver is required'),
  content: z.string().min(1, 'Content is required'),
});

const callSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  receiver: z.string().min(1, 'Receiver is required'),
  duration: z.number().min(1, 'Duration must be at least 1 second'),
});

const internetSchema = z.object({
  consumer: z.string().min(1, 'Consumer is required'),
  dataSize: z.number().min(1, 'Data size must be at least 1 MB'),
});


const TransactionForm = ({ title, schema, onSubmit, fields, users, isLoading }) => {
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
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <form onSubmit={handleSubmit(onSubmitWrapper)}>
        {fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            defaultValue=""
            render={({ field: inputField, fieldState: { error } }) => (
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
            )}
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
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </Paper>
  );
};

const Transactions = () => {
  const sendSmsMutation = useSendSms();
  const makeVoiceCallMutation = useMakeVoiceCall();
  const consumeInternetMutation = useConsumeInternet();
  const { data: usersResponse, isLoading: isLoadingUsers, error: usersError } = useAllUsers();

  const users = usersResponse?.[0]?.data || [];

  if (isLoadingUsers) return <CircularProgress />;
  if (usersError) return <Typography color="error">Error loading users: {usersError.message}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TransactionForm
            title="Send SMS"
            schema={smsSchema}
            onSubmit={sendSmsMutation.mutateAsync}
            fields={[
              { name: 'sender', label: 'Sender', type: 'select' },
              { name: 'receiver', label: 'Receiver', type: 'select' },
              { name: 'content', label: 'Content' },
            ]}
            users={users}
            isLoading={sendSmsMutation.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TransactionForm
            title="Make Voice Call"
            schema={callSchema}
            onSubmit={makeVoiceCallMutation.mutateAsync}
            fields={[
              { name: 'sender', label: 'Sender', type: 'select' },
              { name: 'receiver', label: 'Receiver', type: 'select' },
              { name: 'duration', label: 'Duration (seconds)', type: 'number' },
            ]}
            users={users}
            isLoading={makeVoiceCallMutation.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TransactionForm
            title="Consume Internet"
            schema={internetSchema}
            onSubmit={consumeInternetMutation.mutateAsync}
            fields={[
              { name: 'consumer', label: 'Consumer', type: 'select' },
              { name: 'dataSize', label: 'Data Size (MB)', type: 'number' },
            ]}
            users={users}
            isLoading={consumeInternetMutation.isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transactions;