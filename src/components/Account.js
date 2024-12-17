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
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    // Load available accounts from localStorage
    try {
      const accountsData = localStorage.getItem('available_accounts');
      if (accountsData) {
        const accounts = JSON.parse(accountsData);
        console.log('Loaded accounts:', accounts); // Debug log
        setAvailableAccounts(accounts);
        
        // If account_id is already set, use it
        const currentAccountId = localStorage.getItem('account_id');
        if (currentAccountId) {
          const account = accounts.find(acc => acc.account_id === parseInt(currentAccountId));
          if (account) {
            setSelectedAccount(account);
          }
        }
      } else {
        console.error('No accounts data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  }, []);

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    localStorage.setItem('account_id', account.account_id.toString());
    localStorage.setItem('currency', account.currency);
    fetchBalance();
    fetchStatements();
  };

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
    if (selectedAccount) {
      fetchBalance();
      fetchStatements();
    }
  }, [selectedAccount]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!selectedAccount) {
      setError('Please select an account first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const app_id = localStorage.getItem('app_id');
      await axios.post('https://fs191x.buildship.run/dtrader-next/deposit', {
        amount: parseFloat(amount),
        currency: selectedAccount.currency,
        account_id: selectedAccount.account_id,
        app_id
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setSuccess(`Successfully deposited ${amount} ${selectedAccount.currency}`);
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      console.error('Deposit failed:', error.response?.data || error);
      setError(error.response?.data?.message || 'Deposit failed. Please try again.');
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
    if (!selectedAccount) {
      setError('Please select an account first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const app_id = localStorage.getItem('app_id');
      await axios.post('https://fs191x.buildship.run/dtrader-next/withdraw', {
        amount: parseFloat(amount),
        currency: selectedAccount.currency,
        account_id: selectedAccount.account_id,
        app_id
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setSuccess(`Successfully withdrawn ${amount} ${selectedAccount.currency}`);
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      console.error('Withdrawal failed:', error.response?.data || error);
      setError(error.response?.data?.message || 'Withdrawal failed. Please try again.');
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

        <Paper sx={{ mb: 4, p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Select Account
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {availableAccounts.map((account) => (
              <Button
                key={account.account_id}
                variant={selectedAccount?.account_id === account.account_id ? "contained" : "outlined"}
                onClick={() => handleAccountSelect(account)}
                startIcon={<AccountBalance />}
                sx={{ minWidth: '150px' }}
              >
                {account.currency}
              </Button>
            ))}
          </Box>
          {selectedAccount && (
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              Current Balance: {balance} {selectedAccount.currency}
            </Typography>
          )}
        </Paper>

        {selectedAccount ? (
          <>
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
                      startAdornment: <Typography sx={{ mr: 1 }}>{selectedAccount.currency}</Typography>
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
                      startAdornment: <Typography sx={{ mr: 1 }}>{selectedAccount.currency}</Typography>
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
                            {statement.amount}
                          </TableCell>
                          <TableCell>{new Date(statement.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Paper>
          </>
        ) : (
          <Alert severity="info">
            Please select an account to view details and perform transactions
          </Alert>
        )}
      </Container>
    </Box>
  );
}

export default Account;
