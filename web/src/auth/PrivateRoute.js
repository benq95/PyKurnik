import React from 'react';
import { Route } from 'react-router-dom';

import { AuthContext } from './Auth';
import { Login } from '../pages/Login';

export const PrivateRoute = ({ component: Component, path, exact, ...props }) => {
    const auth = React.useContext(AuthContext);

    return (
        <Route
            exact={exact}
            path={path}
            render={() => (auth.user ? <Component {...props} /> : <Login />)}
        />
    );
};
