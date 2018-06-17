import {User} from '../services/AuthService';
import {Actions, ActionsTypes} from './actions';

export interface AppReducerState {
    jwtToken?: string;
    user?: User;
}

export const INITIAL_STATE: AppReducerState = {};

const appReducer = (state: AppReducerState = INITIAL_STATE, action: Actions): AppReducerState => {
    switch (action.type) {

        case ActionsTypes.AUTHENTICATED:
            return {...state, jwtToken: action.jwtToken, user: action.user};

        default:
            return state;
    }
};

export default appReducer;
