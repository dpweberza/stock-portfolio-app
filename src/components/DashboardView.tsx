import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Table} from 'reactstrap';
import AlphaAdvantageService, {StockQuoteResponse} from '../services/AlphaAdvantageService';
import UserService, {Stock, User} from '../services/UserService';
import {StoreState} from '../store/store';

interface StateProps {
    user: User;
    jwtToken: string;
}

type Props = StateProps & RouteComponentProps<{}>;

interface State {
    stocks?: Stock[];
    stockQuote?: StockQuoteResponse;
}

class DashboardView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public async componentDidMount() {
        const {jwtToken} = this.props;

        try {
            const userStockData = await UserService.getUserStocks(jwtToken);
            this.setState({stocks: userStockData.stocks});

            try {
                const stockQuoteData = await AlphaAdvantageService.stockQuote(userStockData.stocks.map((stock) => stock.symbol));
                this.setState({stockQuote: stockQuoteData});
            } catch (e) {
                alert('Unfortunately we could not retrieve live stock prices at this time')
            }
        } catch (e) {
            alert('Unfortunately we could not retrieve your stock holdings at this time')
        }
    }

    public render() {
        const stocksTable = this.renderMyStocksCard();
        const balanceCard = this.renderMyBalanceCard();
        return (
            <React.Fragment>
                <h1 className="h2 border-bottom pb-2">Dashboard</h1>
                <div className="row">
                    <div className="col-12">
                        {balanceCard}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {stocksTable}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private renderMyBalanceCard() {
        const {user} = this.props;
        return (
            <div className="card mb-2">
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
        const {stocks, stockQuote} = this.state;
        if (!stocks) {
            return false;
        }

        let total: number | string = 0;
        const rows = stocks.length === 0 ? (
            <tr>
                <td colSpan={2}>No stocks</td>
            </tr>
        ) : stocks.map((stock) => {
            const quote = stockQuote && stockQuote['Stock Quotes'].find((aStockQuote) => aStockQuote['1. symbol'] === stock.symbol);
            let symbolTotal: number | string = 'Unavailable';
            if (quote) {
                const calc = parseFloat(quote['2. price']) * stock.count;
                symbolTotal = (calc).toFixed(2);
                (total as number) += calc;
            }
            return (
                <tr key={stock.symbol}>
                    <td>{stock.symbol}</td>
                    <td>{stock.count}</td>
                    <td className="text-right">{quote ? quote['2. price'] : 'Unavailable'}</td>
                    <td className="text-right">{symbolTotal}</td>
                </tr>
            )
        });
        if (!stockQuote) {
            total = 'Unavailable';
        }

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
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colSpan={3}>Total asset value:</th>
                            <th className="text-right">{total}</th>
                        </tr>
                        </tfoot>
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
