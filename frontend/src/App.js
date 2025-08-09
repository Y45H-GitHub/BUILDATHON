import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import DockDispatcher from './pages/DockDispatcher';
import DriverView from './pages/DriverView';
import InventorySpotter from './pages/InventorySpotter';
import RouteOptimizer from './pages/RouteOptimizer';
import ComplianceChecker from './pages/ComplianceChecker';
import FreightQuotes from './pages/FreightQuotes';
import RiskDashboard from './pages/RiskDashboard';
import BlockchainProvenance from './pages/BlockchainProvenance';
import AIChat from './components/AIChat/AIChat';
import './App.css';

const { Content } = Layout;

function App() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                    <Header />
                    <Content style={{ margin: '16px', background: '#f0f2f5' }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dispatcher" element={<DockDispatcher />} />
                            <Route path="/driver" element={<DriverView />} />
                            <Route path="/inventory" element={<InventorySpotter />} />
                            <Route path="/routes" element={<RouteOptimizer />} />
                            <Route path="/compliance" element={<ComplianceChecker />} />
                            <Route path="/freight" element={<FreightQuotes />} />
                            <Route path="/risk" element={<RiskDashboard />} />
                            <Route path="/blockchain" element={<BlockchainProvenance />} />
                        </Routes>
                    </Content>
                </Layout>
                <AIChat />
            </Layout>
        </Router>
    );
}

export default App;