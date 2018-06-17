import {combineReducers, createStore,} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import persistState from 'redux-localstorage';

import appReducer, {AppReducerState} from './reducer';

export interface StoreState {
    app: AppReducerState;
}

const rootReducer = combineReducers({
    app: appReducer,
});

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

export const configureStore = (initialState?: StoreState) => createStore(rootReducer, initialState || {}, composeEnhancers(
    persistState() as any,
));

const defaultStore = configureStore();

export default defaultStore;
