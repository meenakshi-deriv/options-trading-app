import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, AppBar, Toolbar, Button, 
  TextField, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import { Link } from 'react-router-dom';
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
      console.error('Failed to fetch statements:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchStatements();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fs191x.buildship.run/dtrader-next/deposit', {
        amount: parseFloat(amount),
        currency: localStorage.getItem('currency')
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fs191x.buildship.run/dtrader-next/withdraw', {
        amount: parseFloat(amount),
        currency: localStorage.getItem('currency')
      }, {
        headers: {
          Authorization: Cookies.get('champion_token')
        }
      });
      setAmount('');
      fetchBalance();
      fetchStatements();
    } catch (error) {
      console.error('Withdraw failed:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Account Management
          </Typography>
          <Button color="inherit" component={Link} to="/trading">
            Trading
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
          Balance: {balance} {localStorage.getItem('currency')}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Deposit" />
            <Tab label="Withdraw" />
            <Tab label="Statement" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleDeposit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Deposit
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleWithdraw}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Withdraw
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
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
                  <TableRow key={statement.id}>
                    <TableCell>{statement.id}</TableCell>
                    <TableCell>{statement.type}</TableCell>
                    <TableCell>{statement.amount}</TableCell>
                    <TableCell>{new Date(statement.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Container>
    </>
  );
}

export default Account;
