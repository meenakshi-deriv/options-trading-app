import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import { AccountCircle, Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Trading() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buyData, setBuyData] = useState({
    contract_id: '',
    price: ''
  });
  const [sellData, setSellData] = useState({
    buy_id: '',
    price: ''
  });

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

  const fetchOpenPositions = async () => {
    try {
      const app_id = localStorage.getItem('app_id');
      const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/open_positions?app_id=${app_id}`, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      if (response.data.length > 0) {
        setSellData(prev => ({ ...prev, buy_id: response.data.result[0].buy_id }));
      }
    } catch (error) {
      setError('Failed to fetch open positions. Please try again.');
      console.error('Failed to fetch open positions:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchOpenPositions();
  }, []);

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('https://fs191x.buildship.run/dtrader-next/buy', {
        ...buyData,
        account_id: localStorage.getItem('account_id'),
        app_id: localStorage.getItem('app_id')
      }, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      setSuccess('Buy order placed successfully!');
      setBuyData({ contract_id: '', price: '' });
      fetchBalance();
      fetchOpenPositions();
    } catch (error) {
      setError('Buy order failed. Please try again.');
      console.error('Buy failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('https://fs191x.buildship.run/dtrader-next/sell', {
        ...sellData,
        app_id: localStorage.getItem('app_id')
      }, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      setSuccess('Sell order placed successfully!');
      setSellData({ buy_id: '', price: '' });
      fetchBalance();
      fetchOpenPositions();
    } catch (error) {
      setError('Sell order failed. Please try again.');
      console.error('Sell failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Options Trading Platform
          </Typography>
          <IconButton color="inherit" onClick={() => { fetchBalance(); fetchOpenPositions(); }}>
            <Refresh />
          </IconButton>
          <Button
            color="inherit"
            component={Link}
            to="/account"
            startIcon={<AccountCircle />}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          <Typography variant="h4" sx={{ mb: 2, color: '#1976d2', display: 'flex', alignItems: 'center' }}>
            Balance: <Box component="span" sx={{ ml: 2, color: 'success.main', fontWeight: 'bold' }}>
              {balance} {localStorage.getItem('currency')}
            </Box>
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
                  Buy Option
                </Typography>
                <Box component="form" onSubmit={handleBuy}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="contract_id"
                    label="Contract ID"
                    value={buyData.contract_id}
                    onChange={(e) => setBuyData({ ...buyData, contract_id: e.target.value })}
                    disabled={loading}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price"
                    label="Price"
                    type="number"
                    value={buyData.price}
                    onChange={(e) => setBuyData({ ...buyData, price: e.target.value })}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: 'success.main',
                      '&:hover': { bgcolor: 'success.dark' },
                      height: '48px'
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Buy'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
                  Sell Option
                </Typography>
                <Box component="form" onSubmit={handleSell}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="buy_id"
                    label="Buy ID"
                    value={sellData.buy_id}
                    onChange={(e) => setSellData({ ...sellData, buy_id: e.target.value })}
                    disabled={loading}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="price"
                    label="Price"
                    type="number"
                    value={sellData.price}
                    onChange={(e) => setSellData({ ...sellData, price: e.target.value })}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: 'error.main',
                      '&:hover': { bgcolor: 'error.dark' },
                      height: '48px'
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sell'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Trading;
