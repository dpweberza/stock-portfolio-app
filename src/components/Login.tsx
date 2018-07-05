import {Field, Formik, FormikActions} from 'formik';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Button, Form, FormGroup, Input, Jumbotron} from 'reactstrap';
import {bindActionCreators, Dispatch} from 'redux';
import * as Yup from 'yup';
import UserService from '../services/UserService';
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
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Please enter in your username'),
                    password: Yup.string().required('Please enter in your password')
                })}
                onSubmit={this.onSubmit}
                render={({handleSubmit, isSubmitting, touched, errors}) => (
                    <div className="container pt-2">
                        <Jumbotron>
                            <h1 className="display-4">My Stock Portfolio</h1>
                            <p className="lead">Your trusty stock tracking tool!</p>
                        </Jumbotron>
                        <Form className="form-signin" onSubmit={handleSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Welcome, please login</h1>
                            <Field
                                name="username"
                                render={({field}) => (
                                    <FormGroup>
                                        <Input
                                            {...field}
                                            placeholder="Username"
                                            className={errors.username ? 'form-control mb-2 is-invalid' : 'form-control mb-2'}
                                        />
                                        {touched.username && errors.username && (
                                            <div className="invalid-feedback">
                                                {errors.username}
                                            </div>
                                        )}
                                    </FormGroup>
                                )}
                            />
                            <Field
                                name="password"
                                render={({field}) => (
                                    <FormGroup>
                                        <Input
                                            {...field}
                                            placeholder="Password"
                                            className={errors.username ? 'form-control mb-2 is-invalid' : 'form-control mb-2'}
                                        />
                                        {touched.password && errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                    </FormGroup>
                                )}
                            />
                            <Button className="btn btn-lg btn-primary btn-block" disabled={isSubmitting}>Login</Button>
                        </Form>
                    </div>
                )}
            />
        );
    }

    private async onSubmit(values: FormValues, actions: FormikActions<FormValues>) {
        const {onAuth, history} = this.props;
        try {
            const data = await UserService.login(values.username, values.password);
            onAuth(data.token, data.user);
            history.push('/');
        } catch (e) {
            alert('Incorrect credentials or server error.');
        } finally {
            actions.setSubmitting(false);
        }
    }
}

//
// Redux wiring
//
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(actionCreators, dispatch);

export default connect<{}, DispatchProps, {}>(null, mapDispatchToProps as any)(Login);

