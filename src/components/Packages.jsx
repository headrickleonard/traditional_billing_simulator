import React from 'react';
import { Typography, Grid, Paper, TextField, Button, Box, CircularProgress } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSetInternetPackage, useSetVoicePackage, useSetSmsPackage } from '../api/hooks';
import { useSnackbar } from 'notistack';

const packageSchema = z.object({
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Price must be a non-negative number',
  }),
});

const PackageForm = ({ title, onSubmit, control, isLoading }) => (
  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <form onSubmit={onSubmit}>
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
            disabled={isLoading}
            inputProps={{ step: "0.01" }}
          />
        )}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Set Package'}
      </Button>
    </form>
  </Paper>
);

const Packages = () => {
  const { enqueueSnackbar } = useSnackbar();

  const internetForm = useForm({ 
    resolver: zodResolver(packageSchema),
    defaultValues: { price: '' },
  });
  const voiceForm = useForm({ 
    resolver: zodResolver(packageSchema),
    defaultValues: { price: '' },
  });
  const smsForm = useForm({ 
    resolver: zodResolver(packageSchema),
    defaultValues: { price: '' },
  });

  const setInternetPackageMutation = useSetInternetPackage();
  const setVoicePackageMutation = useSetVoicePackage();
  const setSmsPackageMutation = useSetSmsPackage();

  const handleSetPackage = async (data, mutation, formReset, packageType) => {
    try {
      await mutation.mutateAsync({ price: parseFloat(data.price) });
      formReset();
      enqueueSnackbar(`${packageType} package set successfully`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || `Failed to set ${packageType} package`, { variant: 'error' });
    }
  };

  const onSetInternetPackage = (data) => handleSetPackage(data, setInternetPackageMutation, internetForm.reset, 'Internet');
  const onSetVoicePackage = (data) => handleSetPackage(data, setVoicePackageMutation, voiceForm.reset, 'Voice');
  const onSetSmsPackage = (data) => handleSetPackage(data, setSmsPackageMutation, smsForm.reset, 'SMS');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Packages</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <PackageForm 
            title="Set Internet Package" 
            onSubmit={internetForm.handleSubmit(onSetInternetPackage)}
            control={internetForm.control}
            isLoading={setInternetPackageMutation.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PackageForm 
            title="Set Voice Package" 
            onSubmit={voiceForm.handleSubmit(onSetVoicePackage)}
            control={voiceForm.control}
            isLoading={setVoicePackageMutation.isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PackageForm 
            title="Set SMS Package" 
            onSubmit={smsForm.handleSubmit(onSetSmsPackage)}
            control={smsForm.control}
            isLoading={setSmsPackageMutation.isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Packages;