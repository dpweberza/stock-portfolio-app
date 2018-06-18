import {Field, Formik} from 'formik';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Button, Form, Input} from 'reactstrap';
import {bindActionCreators} from 'redux';
import AlphaAdvantageService, {StockQuoteResponse} from '../services/AlphaAdvantageService';
import {User} from '../services/UserService';
import {logout} from '../store/actions';
import {StoreState} from '../store/store';

interface State {
    stockData?: StockQuoteResponse;
}

interface StateProps {
    user: User;
}

const actionCreators = {
    onLogout: logout,
};
type DispatchProps = typeof actionCreators;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

class PurchaseView extends React.Component<Props, State> {

    private searchField: HTMLInputElement;

    constructor(props: Props) {
        super(props);
        this.state = {};
        this.searchStock = this.searchStock.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.bindSearchField = this.bindSearchField.bind(this);
    }

    public render() {
        const form = this.renderForm();
        return (
            <React.Fragment>
                <h1 className="h2">Buy Stocks</h1>
                <Form onSubmit={this.onSearchSubmit} className="mb-2">
                    <Input
                        onBlur={this.searchStock}
                        placeholder="Search stocks, e.g. GOOG"
                        className="form-control form-control-lg"
                        innerRef={this.bindSearchField}
                    />
                </Form>
                {form}
            </React.Fragment>
        );
    }

    private renderForm() {
        const {stockData} = this.state;
        if (!stockData || !stockData['Stock Quotes']) {
            return false;
        }

        const stock = stockData['Stock Quotes'][0];

        const form = (
            <Formik
                initialValues={{
                    quantity: 1,
                }}
                onSubmit={this.onPurchase}
                render={({handleSubmit, isSubmitting, values}) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Stock</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={stock['1. symbol']}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Unit Price</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={stock['2. price']}/>
                            </div>
                        </div>
                        <Field
                            name="quantity"
                            render={({field}) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Quantity</label>
                                    <div className="col-sm-10">
                                        <Input {...field} />
                                    </div>
                                </div>
                            )}
                        />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Total</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={parseFloat(stock['2. price']) * values.quantity}/>
                            </div>
                        </div>
                        <Button className="btn btn-lg btn-primary btn-block" disabled={isSubmitting}>Purchase</Button>
                    </Form>
                )}
            />
        );

        return form;
    }

    private async searchStock() {
        const stockData = await AlphaAdvantageService.stockQuote([this.searchField.value]);
        this.setState({stockData});
    }

    private async onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.searchStock();
    }

    private bindSearchField(node: HTMLInputElement) {
        this.searchField = node;
    }

    private async onPurchase() {
        // TODO
    }
}

//
// Redux wiring
//
const mapStateToProps = (state: StoreState): StateProps => ({
    user: state.app.user!,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(PurchaseView);
