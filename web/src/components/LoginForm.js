import React, { useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';

import styles from './LoginForm.module.css';
import { AuthContext } from '../auth/Auth';

const FormItem = Form.Item;

const LoginForm = props => {
    const { setUser } = useContext(AuthContext);

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                setUser(values);
                localStorage.setItem('user', JSON.stringify(values));
            }
        });
    };

    const { getFieldDecorator } = props.form;

    return (
        <Form onSubmit={handleSubmit} className={styles.loginForm}>
            <FormItem>
                {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                    />,
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                    />,
                )}
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
                    Log in
                </Button>
                Or <a href="/#">register now!</a>
            </FormItem>
        </Form>
    );
};

export const LoginFormContainer = Form.create()(LoginForm);
