import React, { useState, useMemo } from 'react';

export const AuthContext = React.createContext();

export const Auth = (props, context) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const value = useMemo(() => ({ user, setUser }), [user]);

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};
