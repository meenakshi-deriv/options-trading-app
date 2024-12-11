import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, AppBar, Toolbar, Button, 
  TextField, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Alert,
  CircularProgress, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountBalance, Refresh } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Account() {
  const [tabValue, setTabValue] = useState(0);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    try {
      const app_id = localStorage.getItem('app_id');
      const account_id = localStorage.getItem('account_id');
      const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/balance?app_id=${app_id}&account_id=${account_id}`, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      setBalance(response.data.result.balance);
    } catch (error) {
      setError('Failed to fetch balance. Please try again.');
      console.error('Failed to fetch balance:', error);
    }
  };

  const fetchStatements = async () => {
    try {
      const app_id = localStorage.getItem('app_id');
      const account_id = localStorage.getItem('account_id');
      const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/statement?app_id=${app_id}&account_id=${account_id}`, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      setStatements(response.data);
    } catch (error) {
      setError('Failed to fetch statements. Please try again.');
      console.error('Failed to fetch statements:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchStatements();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('https://fs191x.buildship.run/dtrader-next/deposit', {
        amount: parseFloat(amount),
        currency: localStorage.getItem('currency')
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setSuccess(`Successfully deposited ${amount} ${localStorage.getItem('currency')}`);
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      setError('Deposit failed. Please try again.');
      console.error('Deposit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > balance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('https://fs191x.buildship.run/dtrader-next/withdraw', {
        amount: parseFloat(amount),
        currency: localStorage.getItem('currency')
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setSuccess(`Successfully withdrawn ${amount} ${localStorage.getItem('currency')}`);
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      setError('Withdrawal failed. Please try again.');
      console.error('Withdraw failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Account Management
          </Typography>
          <IconButton color="inherit" onClick={() => { fetchBalance(); fetchStatements(); }}>
            <Refresh />
          </IconButton>
          <Button color="inherit" component={Link} to="/trading">
            Trading
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
            Balance: <Box component="span" sx={{ ml: 2, color: 'success.main', fontWeight: 'bold' }}>
              {balance} {localStorage.getItem('currency')}
            </Box>
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Deposit" />
              <Tab label="Withdraw" />
              <Tab label="Statement" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleDeposit} sx={{ maxWidth: 400, mx: 'auto' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>{localStorage.getItem('currency')}</Typography>
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  height: 48,
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Deposit'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleWithdraw} sx={{ maxWidth: 400, mx: 'auto' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>{localStorage.getItem('currency')}</Typography>
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  height: 48,
                  bgcolor: 'error.main',
                  '&:hover': { bgcolor: 'error.dark' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Withdraw'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statements.map((statement) => (
                    <TableRow key={statement.id} hover>
                      <TableCell>{statement.id}</TableCell>
                      <TableCell>{statement.type}</TableCell>
                      <TableCell sx={{ 
                        color: statement.type === 'deposit' ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {statement.type === 'deposit' ? '+' : '-'}{statement.amount}
                      </TableCell>
                      <TableCell>{new Date(statement.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}

export default Account;
