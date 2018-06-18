import {User} from '../services/UserService';

export type Actions =
    DefaultAction
    | AuthenticatedAction
    | LogoutAction
    | UpdateUserBalanceAction;

export enum ActionsTypes {
    AUTHENTICATED = 'AUTHENTICATED',
    LOGOUT = 'LOGOUT',
    UPDATE_USER_BALANCE = 'UPDATE_USER_BALANCE',
    DEFAULT_ACTION = '',
}

export interface DefaultAction {
    type: ActionsTypes.DEFAULT_ACTION;
}

/**
 * Stores the authentication and user details
 */
export interface AuthenticatedAction {
    type: ActionsTypes.AUTHENTICATED;
    jwtToken: string;
    user: User;
}

export const authenticated = (jwtToken: string, user: User): AuthenticatedAction => ({
    type: ActionsTypes.AUTHENTICATED,
    jwtToken,
    user,
});

/**
 * Clears the authentication and user details
 */
export interface LogoutAction {
    type: ActionsTypes.LOGOUT;
}

export const logout = (): LogoutAction => ({
    type: ActionsTypes.LOGOUT,
});

/**
 * Updates the authenticated user's balance
 */
export interface UpdateUserBalanceAction {
    type: ActionsTypes.UPDATE_USER_BALANCE;
    balance: number;
}

export const updateUserBalance = (balance: number): UpdateUserBalanceAction => ({
    type: ActionsTypes.UPDATE_USER_BALANCE,
    balance,
});