import axios from 'axios';

interface BaseSignupData {
    email: string;
    password: string;
    app_id?: number;
    currency?: string;
}

interface SignupData extends BaseSignupData {
    app_id: number;
    currency: string;
}

interface SigninData {
    email: string;
    password: string;
}

interface DepositData {
    amount: number;
    account_id: string;
    app_id: string;
}

interface WithdrawData {
    amount: number;
    account_id: string;
    app_id: string;
}

interface BuySellData {
    app_id: string;
    account_id: string;
    symbol: string;
    amount: number;
}

const TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiaWF0IjoxNzMzMzc2ODMxLCJleHAiOjE3NjQ5MTI4MjJ9.dobQ9wKzr9tSYuks6FbAxdgTSXx0BOEkKT8WuIQT1JYe0isj5WFTOFpLdYAbhV1tcXthbHHNz8Bk9AiHd0xhoAx49Jqi0BYejoXcIdsBQdFGLuaHgd4IZk2vM4M_McxChqNFFwktjKRswWnAYjFzHl-Fl6sy8Qb9Xt-CTJje8TD7lpmkGMyrAqTcXyUFDBg4-xQM66O0xxV4zn7v0RWmlF4S5JXtyXS0kEFSrgbwinrZ2fpEbDoLSGzz2-_yQO-TSSW9BYPRB077bWZcX0POREumH0ry-bDekwiXOrHKdHoAmmslpqev4-XONLJfXiBZszWdu9WLpgW4r-HTAD22SQ';

const api = axios.create({
    baseURL: 'https://fs191x.buildship.run/dtrader-next',
});

export const signup = (data: BaseSignupData) => {
    const signupData: SignupData = {
        ...data,
        app_id: data.app_id || 1000,
        currency: data.currency || 'USD'
    };
    
    return api.post('/signup', signupData, {
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        }
    });
};

export const signin = (data: SigninData) => api.post('/session', data);
export const deposit = (data: DepositData, token: string) => api.post('/deposit', data, { headers: { 'Authorization': token } });
export const withdraw = (data: WithdrawData, token: string) => api.post('/withdraw', data, { headers: { 'Authorization': token } });
export const getStatement = (appId: string, accountId: string, token: string) => api.get(`/statement?app_id=${appId}&account_id=${accountId}`, { headers: { 'Authorization': token } });
export const buy = (data: BuySellData, token: string) => api.post('/buy', data, { headers: { 'Authorization': token } });
export const sell = (data: BuySellData, token: string) => api.post('/sell', data, { headers: { 'Authorization': token } });
export const getOpenPositions = (appId: string, token: string) => api.get(`/open_positions?app_id=${appId}`, { headers: { 'Authorization': token } });
export const getBalance = (appId: string, accountId: string, token: string) => api.get(`/balance?app_id=${appId}&account_id=${accountId}`, { headers: { 'Authorization': token } });
