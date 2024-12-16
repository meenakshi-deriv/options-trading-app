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
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  const [marketsData, setMarketsData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [tradeTypes, setTradeTypes] = useState([]);
  const [selectedTradeType, setSelectedTradeType] = useState('');
  const [selectedTradeTypeInfo, setSelectedTradeTypeInfo] = useState(null);
  const [openPositions, setOpenPositions] = useState([]);
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

  const fetchInstruments = async () => {
    try {
      const app_id = localStorage.getItem('app_id');
      const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/available-instrument?app_id=${app_id}`);
      setMarketsData(response.data || []);
      // Reset selected values when fetching new data
      setSelectedMarket('');
      setSelectedInstrument('');
      setInstruments([]);
    } catch (error) {
      setError('Failed to fetch available instruments. Please try again.');
      console.error('Failed to fetch instruments:', error);
    }
  };

  const fetchTradeTypes = async (instrument) => {
    console.log("Fetching trade types for instrument:", instrument);
    if (!instrument) return;
    try {
      const app_id = localStorage.getItem('app_id');
      const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/trade-types?app_id=${app_id}&instrument=${instrument}`);
      setTradeTypes(response.data || []);
    } catch (error) {
      setError('Failed to fetch trade types. Please try again.');
      console.error('Failed to fetch trade types:', error);
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
      setOpenPositions(response.data.result || []);
      if (response.data.result?.length > 0) {
        setSellData(prev => ({ ...prev, buy_id: response.data.result[0].buy_id }));
      }
    } catch (error) {
      setError('Failed to fetch open positions. Please try again.');
     // console.error('Failed to fetch open positions:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchOpenPositions();
    fetchInstruments();
  }, []);

  useEffect(() => {
    if (selectedMarket && marketsData.length > 0) {
      const marketData = marketsData.find(market => market.market_name === selectedMarket);
      setInstruments(marketData ? marketData.instruments : []);
      setSelectedInstrument(''); // Reset selected instrument when market changes
      setTradeTypes([]); // Reset trade types when market changes
    }
  }, [selectedMarket, marketsData]);

  useEffect(() => {
    if (selectedInstrument) {
      fetchTradeTypes(selectedInstrument);
      setSelectedTradeType(''); // Reset trade type when instrument changes
      setSelectedTradeTypeInfo(null);
    } else {
      setTradeTypes([]); // Reset trade types when no instrument is selected
      setSelectedTradeTypeInfo(null);
    }
  }, [selectedInstrument]);

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
          <IconButton color="inherit" onClick={() => { 
            fetchBalance(); 
            fetchOpenPositions();
            fetchInstruments();
          }}>
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
          <Grid item xs={12}>
            <Card sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
                  Trading Options
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Select Market</InputLabel>
                      <Select
                        value={selectedMarket}
                        label="Select Market"
                        onChange={(e) => setSelectedMarket(e.target.value)}
                      >
                        
                        {marketsData.map((market) => (
                          <MenuItem key={market.market_name} value={market.market_name}>
                            {market.market_name.replace('_', ' ').toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Select Instrument</InputLabel>
                      <Select
                        value={selectedInstrument}
                        label="Select Instrument"
                        onChange={(e) => setSelectedInstrument(e.target.value)}
                        disabled={!selectedMarket}
                      >
                        {instruments.map((instrument) => (
                          <MenuItem key={instrument} value={instrument}>
                            {instrument}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Select Trade Type</InputLabel>
                      <Select
                        value={selectedTradeType}
                        label="Select Trade Type"
                        onChange={(e) => {
                          setSelectedTradeType(e.target.value);
                          const [tradeType, index] = e.target.value.split('|');
                          setSelectedTradeTypeInfo(tradeTypes[parseInt(index)]);
                        }}
                        disabled={!selectedInstrument}
                      >
                        {tradeTypes.map((type, index) => (
                          type.trade_types.map(tradeType => (
                            <MenuItem key={`${tradeType}-${index}`} value={`${tradeType}|${index}`}>
                              {tradeType}
                            </MenuItem>
                          ))
                        ))}
                      </Select>
                      {selectedTradeTypeInfo && (
                        <Box sx={{ mt: 1, opacity: 0.7, fontSize: '0.875rem' }}>
                          <Typography variant="caption" display="block">
                            Duration: {selectedTradeTypeInfo.duration_min} - {selectedTradeTypeInfo.duration_max}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Expiry Type: {selectedTradeTypeInfo.expiry_type}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Start Type: {selectedTradeTypeInfo.start_type}
                          </Typography>
                        </Box>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

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
                    disabled={loading || !selectedInstrument || !selectedTradeType}
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

          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
                  Open Positions
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Buy ID</TableCell>
                        <TableCell>Contract ID</TableCell>
                        <TableCell>Buy Price</TableCell>
                        <TableCell>Current Price</TableCell>
                        <TableCell>Profit/Loss</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {openPositions.map((position) => (
                        <TableRow key={position.buy_id}>
                          <TableCell>{position.buy_id}</TableCell>
                          <TableCell>{position.contract_id}</TableCell>
                          <TableCell>{position.buy_price}</TableCell>
                          <TableCell>{position.current_price}</TableCell>
                          <TableCell sx={{ 
                            color: position.profit_loss >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {position.profit_loss}
                          </TableCell>
                        </TableRow>
                      ))}
                      {openPositions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No open positions
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Trading;
