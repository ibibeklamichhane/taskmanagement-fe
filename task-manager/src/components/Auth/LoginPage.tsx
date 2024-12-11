import React from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutateAsync: login, isLoading } = useLogin();

  const onFinish = async (values: any) => {
    try {
      const response = await login(values);
   //storing fetching the token in from local storage ,local storage ma  
      const token = response?.data?.token; 
      if (token) {
        localStorage.setItem("token", token); 
        setIsAuthenticated(true); 
        navigate("/tasklist"); 
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 , marginTop: 60, fontWeight: "bold" }}>Login</h2>
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
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" type="email" size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter your password" size="large" />
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

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span>Don't have an account? </span>
          <Button type="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
