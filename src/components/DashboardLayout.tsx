import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {Route, RouteComponentProps, Switch} from 'react-router';
import {DropdownItem, DropdownToggle, Nav, Navbar, NavbarBrand, NavItem, NavLink, UncontrolledDropdown} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {bindActionCreators} from 'redux';
import {User} from '../services/UserService';
import {logout} from '../store/actions';
import {StoreState} from '../store/store';
import BalanceView from './BalanceView';
import DashboardView from './DashboardView';
import PurchaseView from './PurchaseView';

interface StateProps {
    user: User;
}

const actionCreators = {
    onLogout: logout,
};
type DispatchProps = typeof actionCreators;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

class DashboardLayout extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    public render() {
        const {user} = this.props;
        return (
            <React.Fragment>
                <Navbar color="dark" dark={true} fixed="top" expand="md">
                    <NavbarBrand href="/">My Stock Portfolio</NavbarBrand>
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
                <div className="container-fluid">
                    <div className="row content-area">
                        <Nav vertical={true} className="col-md-2 d-md-block bg-light sidebar">
                            <NavItem>
                                <NavLink href="/">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/buy">Buy stocks</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/balance">Manage balance</NavLink>
                            </NavItem>
                        </Nav>
                        <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
                            <Switch>
                                <Route exact={true} path="/" component={DashboardView}/>
                                <Route exact={true} path="/buy" component={PurchaseView}/>
                                <Route exact={true} path="/balance" component={BalanceView}/>
                            </Switch>
                        </main>
                    </div>
                </div>
            </React.Fragment>
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

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(DashboardLayout);
