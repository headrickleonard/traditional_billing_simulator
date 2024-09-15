import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Transactions from './components/Transactions';
import Packages from './components/Packages';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/packages" element={<Packages />} />
            </Routes>
          </Layout>
        </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;