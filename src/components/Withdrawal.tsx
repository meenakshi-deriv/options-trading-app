import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    CircularProgress
} from '@mui/material';

const Withdrawal = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleWithdrawal = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const currency = localStorage.getItem('currency');
            const championTokenRow = document.cookie.split('; ').find(row => row.startsWith('champion_token'));
            const championToken = championTokenRow && championTokenRow.split('=')[1];
            
            await axios.post('https://fs191x.buildship.run/dtrader-next/withdrawal', {
                amount: parseFloat(amount),
                currency
            }, {
                headers: { 'Authorization': championToken }
            });

            setSuccess(`Successfully withdrawn ${amount} ${currency}`);
            setAmount(''); // Clear the input after success
        } catch (err) {
            setError('Failed to process withdrawal. Please try again.');
            console.error('Withdrawal error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3, color: 'primary.main' }}>
                Withdraw Funds
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleWithdrawal(); }}>
                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    placeholder="Enter amount"
                    InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>{localStorage.getItem('currency')}</Typography>
                    }}
                    sx={{ mb: 2 }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleWithdrawal}
                    disabled={loading}
                    sx={{
                        height: 48,
                        bgcolor: 'error.main',
                        '&:hover': { bgcolor: 'error.dark' }
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Withdraw'}
                </Button>
            </Box>
        </Paper>
    );
};

export default Withdrawal;
