import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Statement {
    id: string; 
    type: string;
    amount: number; 
}

const Statement = () => {
    const [statements, setStatements] = useState<Statement[]>([]);

    const fetchStatements = async () => {
        const appId = localStorage.getItem('app_id');
        const accountId = localStorage.getItem('account_id');
        const accessTokenRow = document.cookie.split('; ').find(row => row.startsWith('access_token'));
        const accessToken = accessTokenRow && accessTokenRow.split('=')[1];
        const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/statement?app_id=${appId}&account_id=${accountId}`, {
            headers: { 'Authorization': accessToken }
        });
        setStatements(response.data);
    };

    useEffect(() => {
        fetchStatements();
    }, []);

    return (
        <div>
            <h2>Account Statement</h2>
            <ul>
                {statements.map(statement => (
                    <li key={statement.id}>{statement.type}: {statement.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default Statement;
