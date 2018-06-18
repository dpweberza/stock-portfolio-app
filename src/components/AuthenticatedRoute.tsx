import * as React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, RouteProps} from 'react-router';
import {User} from '../services/UserService';
import {StoreState} from '../store/store';

interface StateProps {
    user?: User;
}

type Props = StateProps & RouteProps;

class AuthenticatedRoute extends React.Component<Props> {

    public render() {
        const {component, user, ...rest} = this.props;
        console.log('render', user, 'test');
        return (
            <Route {...rest} render={(props) => (
                user
                    ? React.createElement(component!, rest)
                    : <Redirect to='/login'/>
            )}/>
        );
    }
}


//
// Redux wiring
//
const mapStateToProps = (state: StoreState): StateProps => ({
    user: state.app.user,
});

export default connect<StateProps, {}, {}>(mapStateToProps)(AuthenticatedRoute);
