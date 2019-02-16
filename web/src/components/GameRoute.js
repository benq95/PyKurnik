import React from 'react';
import { Route } from 'react-router-dom';

export const GameRoute = ({ component: Component, path, exact, ...props }) => {
    const auth = React.useContext(AuthContext);

    return (
        <Route
            exact={exact}
            path={path}
            render={() => (auth.user ? <Component {...props} /> : <Login />)}
        />
    );
};