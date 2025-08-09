import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ControlOutlined,
    CarOutlined,
    InboxOutlined,
    RouteOutlined,
    SafetyOutlined,
    DollarOutlined,
    WarningOutlined,
    BlockOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Smart Dashboard'
        },
        {
            key: '/dispatcher',
            icon: <ControlOutlined />,
            label: 'Dock Dispatcher'
        },
        {
            key: '/driver',
            icon: <CarOutlined />,
            label: 'Driver View'
        },
        {
            key: '/inventory',
            icon: <InboxOutlined />,
            label: 'Inventory Spotter'
        },
        {
            key: '/routes',
            icon: <RouteOutlined />,
            label: 'Route Optimizer'
        },
        {
            key: '/compliance',
            icon: <SafetyOutlined />,
            label: 'Compliance Checker'
        },
        {
            key: '/freight',
            icon: <DollarOutlined />,
            label: 'Freight Quotes'
        },
        {
            key: '/risk',
            icon: <WarningOutlined />,
            label: 'Risk Dashboard'
        },
        {
            key: '/blockchain',
            icon: <BlockOutlined />,
            label: 'Blockchain Provenance'
        }
    ];

    return (
        <Sider width={250} theme="dark">
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
            }}>
                OptiLogix
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />
        </Sider>
    );
};

export default Sidebar;