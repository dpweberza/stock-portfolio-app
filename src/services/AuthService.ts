import axios from 'axios';

export interface User {
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export default class AuthService {

    public static async login(username: string, password: string): Promise<AuthResponse> {
        const response = await axios.post('login', {username, password});
        return response.data;
    }

}