import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from 'react-query';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

// Define interfaces with more precise typing
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginCredentials>();

  const { mutateAsync: loginApi, isLoading } = useMutation<
    LoginResponse, 
    Error, 
    LoginCredentials
  >(login, {
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Optional: Save user ID if returned
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }

      message.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error) => {
      // More detailed error handling
      message.error(error.message || 'Login failed. Please try again.');
      
      // Optionally clear password field or show specific error
      form.setFields([{
        name: 'password',
        errors: [error.message || 'Invalid credentials']
      }]);
    }
  });

  const onFinish = async (values: LoginCredentials) => {
    try {
      await loginApi(values);
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
      <Form 
        form={form}
        onFinish={onFinish} 
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item 
          label="Email" 
          name="email" 
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            placeholder="Enter your email" 
            type="email"
            size="large"
          />
        </Form.Item>

        <Form.Item 
          label="Password" 
          name="password" 
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password 
            placeholder="Enter your password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            loading={isLoading}
          >
            Login
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Don't have an account? </span>
          <Button 
            type="link" 
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;