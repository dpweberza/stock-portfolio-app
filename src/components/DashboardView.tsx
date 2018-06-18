import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Table} from 'reactstrap';
import UserService, {Stock, User} from '../services/UserService';
import {StoreState} from '../store/store';

interface StateProps {
    user: User;
    jwtToken: string;
}

type Props = StateProps & RouteComponentProps<{}>;

interface State {
    stocks?: Stock[];
}

class DashboardView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
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

}

//
// Redux wiring
//
const mapStateToProps = (state: StoreState): StateProps => ({
    jwtToken: state.app.jwtToken!,
    user: state.app.user!,
});

export default connect<StateProps, {}, {}>(mapStateToProps)(DashboardView);
