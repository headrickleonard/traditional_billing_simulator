import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  IconButton,
  Avatar,
  Divider
} from "@mui/material";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Casino as CasinoIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllUsers,
  useRegisterUser,
  useGenerateRandomUsers,
  useUserDetails,
} from "../api/hooks";
import { useSnackbar } from "notistack";
import { styled } from '@mui/material/styles';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Balance must be a non-negative number",
    }),
  nin: z.string().min(1, "NIN is required"),
});

const UserRegistrationForm = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", balance: "0", nin: "" },
  });

  const onSubmitWrapper = async (data) => {
    const formattedData = {
      ...data,
      balance: parseFloat(data.balance),
    };
    await onSubmit(formattedData);
    reset();
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Register New User
      </Typography>
      <form onSubmit={handleSubmit(onSubmitWrapper)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={!!error}
              helperText={error?.message}
              fullWidth
              margin="normal"
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="balance"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Balance"
              type="number"
              error={!!error}
              helperText={error?.message}
              fullWidth
              margin="normal"
              disabled={isLoading}
              inputProps={{ step: "0.01" }}
            />
          )}
        />
        <Controller
          name="nin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="NIN"
              error={!!error}
              helperText={error?.message}
              fullWidth
              margin="normal"
              disabled={isLoading}
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
          {isLoading ? <CircularProgress size={24} /> : "Register User"}
        </Button>
      </form>
    </Paper>
  );
};

const UsersTable = ({
  users,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onViewDetails,
}) => (
  <Paper>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>MSISDN</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.msisdn}</TableCell>
                <TableCell>${user.balance.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onViewDetails(user.msisdn)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={users.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
);
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.default,
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

const DetailItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value !== null ? value.toString() : 'N/A'}
    </Typography>
  </Box>
);

const UserDetailsModal = ({ open, handleClose, userDetails, isLoading }) => (
  <StyledDialog
    open={open}
    onClose={handleClose}
    aria-labelledby="user-details-dialog-title"
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle id="user-details-dialog-title">User Details</DialogTitle>
    <DialogContent dividers>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : userDetails ? (
        <StyledPaper elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="flex-start">
              <LargeAvatar>
                <PersonIcon fontSize="large" />
              </LargeAvatar>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                {userDetails.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                MSISDN: {userDetails.msisdn}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem label="User ID" value={userDetails.userId} />
              <DetailItem label="Balance" value={`$${userDetails.balance.toFixed(2)}`} />
              <DetailItem label="NIN" value={userDetails.nin} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Active" value={userDetails.isActive ? 'Yes' : 'No'} />
              <DetailItem label="SPN" value={userDetails.spn} />
              <DetailItem label="IMSI" value={userDetails.imsi} />
            </Grid>
          </Grid>
        </StyledPaper>
      ) : (
        <Typography>No user details available</Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </StyledDialog>
);

const UserManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    refetch,
  } = useAllUsers();
  const registerUserMutation = useRegisterUser();
  const generateRandomUsersMutation = useGenerateRandomUsers();
  // const userDetailsMutation = useUserDetails();
  // const [selectedMSISDN, setSelectedMSISDN] = useState(null);
  const [selectedMSISDN, setSelectedMSISDN] = useState(null);
  const userDetailsMutation = useUserDetails();
  const { data: selectedUserDetails, isLoading: isLoadingUserDetails } =
    useUserDetails(selectedMSISDN);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [registerUserDialogOpen, setRegisterUserDialogOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRegisterUser = async (data) => {
    try {
      await registerUserMutation.mutateAsync(data);
      refetch();
      enqueueSnackbar("User registered successfully", { variant: "success" });
      setRegisterUserDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to register user", {
        variant: "error",
      });
    }
  };

  const handleGenerateRandom = async () => {
    try {
      await generateRandomUsersMutation.mutateAsync();
      refetch();
      enqueueSnackbar("Random users generated successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to generate random users", {
        variant: "error",
      });
    }
  };

  const handleViewDetails = (msisdn) => {
    setSelectedMSISDN(msisdn);
    setUserDetailsModalOpen(true);
  };

  if (isLoadingUsers) return <CircularProgress />;

  const users = usersResponse?.[0]?.data || [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <UsersTable
        users={users}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        onViewDetails={handleViewDetails}
      />

      <SpeedDial
        ariaLabel="User management actions"
        sx={{ position: "fixed", bottom: 36, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<PersonAddIcon />}
          tooltipTitle="Register User"
          onClick={() => setRegisterUserDialogOpen(true)}
        />
        <SpeedDialAction
          icon={<CasinoIcon />}
          tooltipTitle="Generate Random Users"
          onClick={handleGenerateRandom}
        />
      </SpeedDial>

      <Dialog
        open={registerUserDialogOpen}
        onClose={() => setRegisterUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Register New User</DialogTitle>
        <DialogContent>
          <UserRegistrationForm
            onSubmit={handleRegisterUser}
            isLoading={registerUserMutation.isLoading}
          />
        </DialogContent>
      </Dialog>

      <UserDetailsModal
        open={userDetailsModalOpen}
        handleClose={() => {
          setUserDetailsModalOpen(false);
          setSelectedMSISDN(null);
        }}
        userDetails={selectedUserDetails?.data}
        isLoading={isLoadingUserDetails}
      />
    </Box>
  );
};

export default UserManagement;
