import {User} from '../services/AuthService';

export type Actions =
    DefaultAction
    | AuthenticatedAction;

export enum ActionsTypes {
    AUTHENTICATED = 'AUTHENTICATED',
    DEFAULT_ACTION = '',
}

export interface DefaultAction {
    type: ActionsTypes.DEFAULT_ACTION;
}

/**
 * Sets the loading state
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