import {User} from '../services/AuthService';

export type Actions =
    DefaultAction
    | AuthenticatedAction
    | LogoutAction;

export enum ActionsTypes {
    AUTHENTICATED = 'AUTHENTICATED',
    LOGOUT = 'LOGOUT',
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