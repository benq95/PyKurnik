import React from 'react';
import { Row, Col } from 'antd';

import { LoginFormContainer } from '../components/LoginForm';

import { http } from '../http';

import styles from './Login.module.css';

const makeRequest = () => {
    http.get('/hello')
        .then(res => console.log(res))
        .catch(err => console.log(err));
};

export const Login = () => {
    return (
        <Row type="flex" align="middle" justify="center" className={styles.maxHeight}>
            <Col>
                <LoginFormContainer />
                <button onClick={makeRequest}>Testowy request</button>
            </Col>
        </Row>
    );
};
