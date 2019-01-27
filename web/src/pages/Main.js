import React from 'react';
import { Layout, Menu, Icon } from 'antd';

import { AuthContext } from '../auth/Auth';

import {Checkers} from '../components/Checkers'

const { Header, Content, Sider } = Layout;

export const Main = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const { setUser } = React.useContext(AuthContext);
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100vh' }}
                >
                    <Menu.Item key="1">
                        <Icon type="user" />
                        <span>nav 1</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="video-camera" />
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload" />
                        <span>nav 3</span>
                    </Menu.Item>
                    <Menu.Item key="4" onClick={logout}>
                        <Icon type="logout" />
                        <span>Logout</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                    }}
                >
                    Content
                    <Checkers></Checkers>
                </Content>
            </Layout>
        </Layout>
    );
};
