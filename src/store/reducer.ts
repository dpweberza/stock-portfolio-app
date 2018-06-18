import {User} from '../services/UserService';
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

        case ActionsTypes.LOGOUT: {
            return {...state, jwtToken: undefined, user: undefined};
        }

        case ActionsTypes.UPDATE_USER_BALANCE: {
            const newUser = Object.assign({}, state.user);
            newUser.balance = action.balance;
            return {...state, user: newUser};
        }

        default:
            return state;
    }
};

export default appReducer;
