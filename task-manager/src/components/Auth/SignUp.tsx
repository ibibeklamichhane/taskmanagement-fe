import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from 'react-query';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); 

  const { mutateAsync: registerApi, isLoading } = useMutation(register, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token); 
      message.success('Registration successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Registration failed');
    }
  });

  const onFinish = async (values: any) => {
    try {
      await registerApi(values);
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      <Form 
        form={form}
        onFinish={onFinish} 
        layout="vertical"
      >
        <Form.Item 
          name="name" 
          label="Name" 
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email" 
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email" type="email" />
        </Form.Item>

        <Form.Item 
          name="password" 
          label="Password" 
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;