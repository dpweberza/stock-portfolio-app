import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

import {Provider} from 'react-redux';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import defaultStore from './store/store';

class App extends React.Component {
    public render() {
        return (
            <Provider store={defaultStore}>
                <BrowserRouter>
                    <Switch>
                        <AuthenticatedRoute exact={true} path="/" component={Dashboard}/>
                        <Route path="/login" component={Login}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
