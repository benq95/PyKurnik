import React, { Component} from 'react';

import { PrivateRoute } from './auth/PrivateRoute';

import { Auth } from './auth/Auth';

import { Main } from './pages/Main';

class App extends Component {
    render() {
        return (
            <Auth>
                <PrivateRoute exact path="/" component={Main} />
            </Auth>
        );
    }
}

export default App;
