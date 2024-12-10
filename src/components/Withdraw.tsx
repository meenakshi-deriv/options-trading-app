import React, { useState } from 'react';
import axios from 'axios';

const Withdraw = () => {
    const [amount, setAmount] = useState('');

    const handleWithdraw = async () => {
        const currency = localStorage.getItem('currency');
        const championTokenRow = document.cookie.split('; ').find(row => row.startsWith('champion_token'));
        const championToken = championTokenRow ? championTokenRow.split('=')[1] : undefined;
        await axios.post('https://fs191x.buildship.run/dtrader-next/withdraw', {
            amount,
            currency
        }, {
            headers: { 'Authorization': championToken }
        });
        // Handle success or error
    };

    return (
        <div>
            <h2>Withdraw</h2>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
};

export default Withdraw;
