import axios from 'axios';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    balance: number;
}

export interface Stock {
    symbol: string;
    count: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface StocksReponse {
    stocks: Stock[];
}

interface BalanceResponse {
    balance: number;
}

export default class UserService {

    public static async login(username: string, password: string): Promise<AuthResponse> {
        const response = await axios.post('login', {username, password});
        return response.data;
    }

    public static async getUserStocks(jwtToken: string): Promise<StocksReponse> {
        const response = await axios.get('stocks', this.getAuthConfig(jwtToken));
        return response.data;
    }

    public static async getUserBalance(jwtToken: string): Promise<BalanceResponse> {
        const response = await axios.get('balance', this.getAuthConfig(jwtToken));
        return response.data;
    }

    public static async updateUserBalance(jwtToken: string, amount: number): Promise<BalanceResponse> {
        const response = await axios.post('balance', {amount}, this.getAuthConfig(jwtToken));
        return response.data;
    }

    private static getAuthConfig(jwtToken: string) {
        return {headers: {Authorization: `JWT ${jwtToken}`}};
    }

}