import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Table} from 'reactstrap';
import {bindActionCreators} from 'redux';
import UserService, {Stock, User} from '../services/UserService';
import {logout} from '../store/actions';
import {StoreState} from '../store/store';

interface StateProps {
    user: User;
    jwtToken: string;
}

const actionCreators = {
    onLogout: logout,
};
type DispatchProps = typeof actionCreators;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

interface State {
    stocks?: Stock[];
}

class BuyPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    public async componentDidMount() {
        const {jwtToken} = this.props;
        const response = await UserService.getUserStocks(jwtToken);
        this.setState({stocks: response.stocks});
    }

    public render() {
        const stocksTable = this.renderMyStocksCard();
        const balanceCard = this.renderMyBalanceCard();
        return (
            <React.Fragment>
                <h1 className="h2">Dashboard</h1>
                <div className="row">
                    <div className="col-sm-6">
                        {balanceCard}
                    </div>
                    <div className="col-sm-6">
                        {stocksTable}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private renderMyBalanceCard() {
        const {user} = this.props;
        return (
            <div className="card">
                <div className="card-header">
                    My Cash Balance
                </div>
                <div className="card-body">
                    Your current balance is: {user.balance}
                </div>
            </div>
        );
    }

    private renderMyStocksCard() {
        const {stocks} = this.state;
        if (!stocks) {
            return false;
        }
        const rows = stocks.length === 0 ? (
            <tr>
                <td colSpan={2}>No stocks</td>
            </tr>
        ) : stocks.map((stock) => (
            <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.count}</td>
            </tr>
        ));

        return (
            <div className="card">
                <div className="card-header">
                    My Stocks
                </div>
                <div className="card-body">
                    <Table>
                        <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Units</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                </div>
            </div>
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
    jwtToken: state.app.jwtToken!,
    user: state.app.user!,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(BuyPage);
