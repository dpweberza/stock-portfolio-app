import {Field, Formik, FormikActions, validateYupSchema, yupToFormErrors} from 'formik';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Button, Form, Input} from 'reactstrap';
import {bindActionCreators} from 'redux';
import * as Yup from 'yup';
import AlphaAdvantageService from '../services/AlphaAdvantageService';
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
    price?: number;
}

interface FormValues {
    quantity: number;
    symbol?: string;
    price?: number;
}

class SellView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
        this.onSell = this.onSell.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    public async componentDidMount() {
        const {jwtToken} = this.props;

        try {
            const response = await UserService.getUserStocks(jwtToken);
            this.setState({stocks: response.stocks});
        } catch (e) {
            alert('Unfortunately we could not retrieve your stock holdings at this time')
        }
    }

    public render() {
        const form = this.renderForm();
        return (
            <React.Fragment>
                <h1 className="h2 border-bottom pb-2">Sell Stocks</h1>
                {form}
            </React.Fragment>
        );
    }

    private renderForm() {
        const {stocks, price} = this.state;

        const stockOptions = stocks && stocks.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>{stock.symbol} ({stock.count})</option>
        ));

        const form = (
            <Formik
                initialValues={{
                    quantity: 1,
                    symbol: undefined,
                    price
                }}
                validate={this.validateForm}
                onSubmit={this.onSell}
                render={({handleSubmit, isSubmitting, values, touched, errors, handleChange}) => (
                    <Form onSubmit={handleSubmit}>
                        <Field
                            name="symbol"
                            render={({field}) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Stock</label>
                                    <div className="col-sm-10">
                                        <Input type="select" {...field} className={errors.symbol && 'is-invalid'} onChange={(e) => {
                                            handleChange(e);
                                            this.onSymbolChange(e);
                                        }}>
                                            <option>Please Select</option>
                                            {stockOptions}
                                        </Input>
                                        {touched.symbol && errors.symbol && (
                                            <div className="invalid-feedback">
                                                {errors.symbol}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Unit Price</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={price} className={errors.price && 'is-invalid'}/>
                                {touched.price && errors.price && (
                                    <div className="invalid-feedback">
                                        {errors.price}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Field
                            name="quantity"
                            render={({field}) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Quantity</label>
                                    <div className="col-sm-10">
                                        <Input {...field} className={errors.quantity && 'is-invalid'}/>
                                        {touched.quantity && errors.quantity && (
                                            <div className="invalid-feedback">
                                                {errors.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Total</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={(price || 0) * values.quantity}/>
                            </div>
                        </div>
                        <Button className="btn btn-lg btn-primary btn-block" disabled={isSubmitting}>Sell</Button>
                    </Form>
                )}
            />
        );

        return form;
    }

    private async onSell(values: FormValues, actions: FormikActions<FormValues>) {
        const {jwtToken} = this.props;
        try {
            await UserService.purchaseStocks(jwtToken, values.symbol!, values.quantity);
            actions.resetForm();
            alert('Successfully sold stocks!');
        } catch (e) {
            alert('An unexpected error has occurred, please try again later');
        } finally {
            actions.setSubmitting(false);
        }
    }

    private async onSymbolChange(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            const data = await AlphaAdvantageService.stockQuote([event.currentTarget.value]);
            const price = data['Stock Quotes'] && data['Stock Quotes'].length > 0 ? parseFloat(data['Stock Quotes'][0]['2. price']) : undefined;
            this.setState({price});
        } catch (e) {
            alert('Failed to retrieve stock price, please try again later')
        }
    }

    private async validateForm(values: FormValues) {
        const {stocks, price} = this.state;

        let errors: any = {};

        try {
            const schema = Yup.object().shape({
                quantity: Yup.number().min(0).required('Please enter in the number of units you wish to sell'),
                symbol: Yup.string().required('Please select the stock you wish to sell')
            });
            await validateYupSchema(values, schema);
        } catch (e) {
            errors = Object.assign({}, yupToFormErrors(e), errors);
        }

        const selectedStock = stocks && stocks.find((stock) => stock.symbol === values.symbol);
        if (selectedStock && selectedStock.count < values.quantity) {
            errors.quantity = 'Quantity cannot be greater than current stock holding of: ' + selectedStock.count;
        }

        if (values.symbol && typeof price === 'undefined') {
            errors.price = 'Unable to retrieve stock price at this time';
        }

        if (Object.keys(errors).length) {
            throw errors
        }
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

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(SellView);
