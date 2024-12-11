import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Trading() {
  const [balance, setBalance] = useState(0);
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
      console.error('Failed to fetch open positions:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchOpenPositions();
  }, []);

  const handleBuy = async (e) => {
    e.preventDefault();
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
      fetchBalance();
      fetchOpenPositions();
    } catch (error) {
      console.error('Buy failed:', error);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://fs191x.buildship.run/dtrader-next/sell', {
        ...sellData,
        app_id: localStorage.getItem('app_id')
      }, {
        headers: {
          Authorization: Cookies.get('access_token')
        }
      });
      fetchBalance();
      fetchOpenPositions();
    } catch (error) {
      console.error('Sell failed:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trading Platform
          </Typography>
          <Button color="inherit" component={Link} to="/account">
            Account
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
          Balance: {balance} {localStorage.getItem('currency')}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Buy Option</Typography>
          <Box component="form" onSubmit={handleBuy}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="contract_id"
              label="Contract ID"
              value={buyData.contract_id}
              onChange={(e) => setBuyData({ ...buyData, contract_id: e.target.value })}
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
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: 'green' }}
            >
              Buy
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Sell Option</Typography>
          <Box component="form" onSubmit={handleSell}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="buy_id"
              label="Buy ID"
              value={sellData.buy_id}
              onChange={(e) => setSellData({ ...sellData, buy_id: e.target.value })}
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
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: 'red' }}
            >
              Sell
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Trading;
