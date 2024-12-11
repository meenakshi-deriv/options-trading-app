import React, { useState } from 'react';
import axios from 'axios';

const Buy = () => {
    const [contractId, setContractId] = useState('');
    const [price, setPrice] = useState('');

    const handleBuy = async () => {
        const accountId = localStorage.getItem('account_id');
        const appId = localStorage.getItem('app_id');
        const accessTokenRow = document.cookie.split('; ').find(row => row.startsWith('access_token'));
        const accessToken = accessTokenRow && accessTokenRow.split('=')[1];
        await axios.put('https://fs191x.buildship.run/dtrader-next/buy', {
            contract_id: contractId,
            price,
            account_id: accountId,
            app_id: appId
        }, {
            headers: { 'Authorization': accessToken }
        });
        // Handle success or error
    };

    return (
        <div>
            <h2>Buy</h2>
            <input type="text" value={contractId} onChange={(e) => setContractId(e.target.value)} placeholder="Contract ID" />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={handleBuy} style={{ backgroundColor: 'green' }}>Buy</button>
        </div>
    );
};

export default Buy;
