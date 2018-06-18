import {Field, Formik, FormikActions} from 'formik';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Button, Form, Input} from 'reactstrap';
import {bindActionCreators} from 'redux';
import UserService, {User} from '../services/UserService';
import {logout, updateUserBalance} from '../store/actions';
import {StoreState} from '../store/store';

interface FormValues {
    amount: number,
    typeId?: TransactionType,
}

interface State {
    userBalance?: number;
}

interface StateProps {
    user: User;
    jwtToken: string;
}

const actionCreators = {
    onLogout: logout,
    onBalanceUpdate: updateUserBalance,
};
type DispatchProps = typeof actionCreators;

type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

enum TransactionType {
    Deposit,
    Withdrawal
}

class BalanceView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
        this.onProcess = this.onProcess.bind(this);
    }

    public async componentDidMount() {
        const {jwtToken} = this.props;
        const response = await UserService.getUserBalance(jwtToken);
        this.setState({userBalance: response.balance});
    }

    public render() {
        const form = this.renderForm();
        return (
            <React.Fragment>
                <h1 className="h2">Manage My Balance</h1>
                {form}
            </React.Fragment>
        );
    }

    private renderForm() {
        const {userBalance} = this.state;
        if (typeof userBalance === 'undefined') {
            return false;
        }

        const form = (
            <Formik
                initialValues={{
                    amount: 0,
                    typeId: undefined,
                }}
                onSubmit={this.onProcess}
                render={({handleSubmit, isSubmitting, values}) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Current Balance</label>
                            <div className="col-sm-10">
                                <Input readOnly={true} value={userBalance}/>
                            </div>
                        </div>
                        <Field
                            name="typeId"
                            render={({field}) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Transaction Type</label>
                                    <div className="col-sm-10">
                                        <Input type="select" {...field}>
                                            <option>Please Select</option>
                                            <option value={TransactionType.Deposit}>Deposit</option>
                                            <option value={TransactionType.Withdrawal}>Withdrawal</option>
                                        </Input>
                                    </div>
                                </div>
                            )}
                        />
                        <Field
                            name="amount"
                            render={({field}) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Amount</label>
                                    <div className="col-sm-10">
                                        <Input {...field} />
                                    </div>
                                </div>
                            )}
                        />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">New Balance</label>
                            <div className="col-sm-10">
                                <Input
                                    readOnly={true}
                                    value={Math.max(userBalance + ((values.typeId == TransactionType.Withdrawal ? -1 : 1) * values.amount), 0)}
                                />
                            </div>
                        </div>
                        <Button className="btn btn-lg btn-primary btn-block" disabled={isSubmitting}>Process</Button>
                    </Form>
                )}
            />
        );

        return form;
    }

    private async onProcess(values: FormValues, actions: FormikActions<FormValues>) {
        const {jwtToken, onBalanceUpdate} = this.props;
        const amount = (values.typeId == TransactionType.Withdrawal ? -1 : 1) * values.amount;
        const data = await UserService.updateUserBalance(jwtToken, amount);
        this.setState({userBalance: data.balance});
        onBalanceUpdate(data.balance);
        actions.setSubmitting(false);
        actions.resetForm();
    }
}

//
// Redux wiring
//
const mapStateToProps = (state: StoreState): StateProps => ({
    user: state.app.user!,
    jwtToken: state.app.jwtToken!,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps as any)(BalanceView);
