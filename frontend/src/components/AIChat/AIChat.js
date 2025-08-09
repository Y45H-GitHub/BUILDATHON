import React, { useState } from 'react';
import { FloatButton, Drawer, Input, Button, List, Avatar } from 'antd';
import { MessageOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const AIChat = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: 'Hello! I\'m your OptiLogix AI assistant. I can help you with dock management, inventory tracking, route optimization, and more. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            const response = await axios.post('/api/ai/chat', {
                message: inputValue,
                context: 'dashboard'
            });

            const aiMessage = {
                id: messages.length + 2,
                type: 'ai',
                content: response.data.message,
                timestamp: new Date(),
                suggestions: response.data.suggestions
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: messages.length + 2,
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                style={{ right: 24, bottom: 24 }}
                onClick={() => setOpen(true)}
                badge={{ count: 1 }}
            />

            <Drawer
                title="OptiLogix AI Assistant"
                placement="right"
                width={400}
                onClose={() => setOpen(false)}
                open={open}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
                        <List
                            dataSource={messages}
                            renderItem={(message) => (
                                <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                icon={message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                                                style={{
                                                    backgroundColor: message.type === 'ai' ? '#1890ff' : '#52c41a'
                                                }}
                                            />
                                        }
                                        title={message.type === 'ai' ? 'AI Assistant' : 'You'}
                                        description={
                                            <div>
                                                <div>{message.content}</div>
                                                {message.suggestions && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        {message.suggestions.map((suggestion, index) => (
                                                            <Button
                                                                key={index}
                                                                size="small"
                                                                type="link"
                                                                onClick={() => setInputValue(suggestion)}
                                                                style={{ padding: '0 4px', height: 'auto' }}
                                                            >
                                                                {suggestion}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={sendMessage}
                            placeholder="Ask me anything about OptiLogix..."
                            disabled={loading}
                        />
                        <Button
                            type="primary"
                            onClick={sendMessage}
                            loading={loading}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default AIChat;