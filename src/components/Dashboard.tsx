import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {DropdownItem, DropdownToggle, Input, Nav, Navbar, NavbarBrand, UncontrolledDropdown} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {bindActionCreators} from 'redux';
import {User} from '../services/AuthService';
import {logout} from '../store/actions';
import {StoreState} from '../store/store';

interface StateProps {
    user: User;
}

const actionCreators = {
    onLogout: logout,
};
type DispatchProps = typeof actionCreators;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

class Dashboard extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    public render() {
        const {user} = this.props;
        return (
            <Navbar color="dark" dark={true} fixed="top" expand="md">
                <NavbarBrand href="/">My Stock Portfolio</NavbarBrand>
                <Input className="form-control form-control-dark w-100" type="text" placeholder="Search"/>
                <Nav className="ml-auto" navbar={true}>
                    <UncontrolledDropdown nav={true} inNavbar={true}>
                        <DropdownToggle nav={true} caret={true} className="text-nowrap">
                            Welcome {user.firstName}
                        </DropdownToggle>
                        <DropdownMenu right={true}>
                            <DropdownItem onClick={this.logout}>
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
        );
    }

    private logout() {
        const {onLogout} = this.props;
        onLogout();
    }
}

//
// Redux wiring
//
const mapStateToProps = (state: StoreState): StateProps => ({
    user: state.app.user!,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(Dashboard);
