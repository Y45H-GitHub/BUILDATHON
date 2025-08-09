import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TruckOutlined, InboxOutlined, SafetyOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/analytics/dashboard');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const mockChartData = [
        { name: 'Mon', deliveries: 24, efficiency: 85 },
        { name: 'Tue', deliveries: 32, efficiency: 88 },
        { name: 'Wed', deliveries: 28, efficiency: 92 },
        { name: 'Thu', deliveries: 35, efficiency: 87 },
        { name: 'Fri', deliveries: 42, efficiency: 95 },
        { name: 'Sat', deliveries: 18, efficiency: 78 },
        { name: 'Sun', deliveries: 12, efficiency: 82 }
    ];

    const recentActivities = [
        { key: 1, time: '10:30 AM', activity: 'Truck T001 assigned to Dock D002', status: 'Success' },
        { key: 2, time: '10:15 AM', activity: 'Route optimized for delivery batch #1247', status: 'Success' },
        { key: 3, time: '09:45 AM', activity: 'Compliance check completed for Truck T003', status: 'Warning' },
        { key: 4, time: '09:30 AM', activity: 'Inventory updated for Product ABC123', status: 'Success' }
    ];

    const columns = [
        { title: 'Time', dataIndex: 'time', key: 'time' },
        { title: 'Activity', dataIndex: 'activity', key: 'activity' },
        { title: 'Status', dataIndex: 'status', key: 'status' }
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '24px' }}>
            <h1>Smart Dashboard</h1>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Trucks"
                            value={analytics?.truckStats?.find(s => s.status === 'in_transit')?.count || 12}
                            prefix={<TruckOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Dock Utilization"
                            value={analytics?.dockUtilization ?
                                Math.round((analytics.dockUtilization.occupied_docks / analytics.dockUtilization.total_docks) * 100) : 75}
                            suffix="%"
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Compliance Score"
                            value={94}
                            suffix="%"
                            prefix={<SafetyOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Cost Savings"
                            value={15420}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card title="Weekly Performance Trends">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="deliveries" stroke="#8884d8" />
                                <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="System Health">
                        <div style={{ marginBottom: '16px' }}>
                            <div>API Response Time</div>
                            <Progress percent={85} status="active" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <div>Database Performance</div>
                            <Progress percent={92} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <div>Network Connectivity</div>
                            <Progress percent={98} />
                        </div>
                        <div>
                            <div>AI Model Accuracy</div>
                            <Progress percent={87} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Recent Activities">
                        <Table
                            dataSource={recentActivities}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;