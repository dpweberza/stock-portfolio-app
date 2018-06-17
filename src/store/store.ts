import {
    combineReducers,
    createStore,
} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import appReducer, {AppReducerState} from './reducer';

export interface StoreState {
    app: AppReducerState;
}

const rootReducer = combineReducers({
    app: appReducer,
});

export const configureStore = (initialState?: StoreState) => createStore(rootReducer, initialState || {}, composeWithDevTools());

const defaultStore = configureStore();

export default defaultStore;
