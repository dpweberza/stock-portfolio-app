import {Field, Formik, FormikActions} from 'formik';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Button, Form, Input} from 'reactstrap';
import {bindActionCreators} from 'redux';
import AuthService from '../services/AuthService';
import {authenticated} from '../store/actions';

interface FormValues {
    username: string;
    password: string;
}

const actionCreators = {
    onAuth: authenticated,
};
type DispatchProps = typeof actionCreators;

type Props = DispatchProps & RouteComponentProps<{}>;

class Login extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    public render() {
        return (
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                onSubmit={this.onSubmit}
                render={({handleSubmit, isSubmitting}) => (
                    <Form className="form-signin" onSubmit={handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Welcome, please login</h1>
                        <Field
                            name="username"
                            render={({field}) => (
                                <Input {...field} placeholder="Username"/>
                            )}
                        />
                        <Field
                            name="password"
                            render={({field}) => (
                                <Input {...field} placeholder="Password"/>
                            )}
                        />
                        <Button className="btn btn-lg btn-primary btn-block" disabled={isSubmitting}>Login</Button>
                    </Form>
                )}
            />
        );
    }

    private async onSubmit(values: FormValues, actions: FormikActions<FormValues>) {
        const {onAuth, history} = this.props;
        try {
            const data = await AuthService.login(values.username, values.password);
            onAuth(data.token, data.user);
            history.push('/');
        } catch (e) {
            alert('Incorrect credentials or server error.');
            actions.setSubmitting(false);
        }
    }
}

//
// Redux wiring
//
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<{}, DispatchProps, {}>(null, mapDispatchToProps as any)(Login);

