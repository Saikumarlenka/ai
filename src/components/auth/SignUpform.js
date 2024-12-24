import React from "react";
import { Button, Input, Form } from "antd";

const SignUpForm = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit} className="space-y-4 w-9/12 mx-auto">
      <Form.Item
        label={<span className="text-white">Name</span>}
        name="name"
        rules={[{ required: true, message: "Please enter your name!" }]}
      >
        <Input placeholder="Enter your name" className="h-10 " />
      </Form.Item>
      <Form.Item
        label={<span className="text-white">Email</span>}
        name="email"
        rules={[{ required: true, message: "Please enter your email!" }]}
      >
        <Input placeholder="Enter your email" className="h-10"/>
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password placeholder="Enter your password"  className="h-10"/>
      </Form.Item>
      <Button type="primary" htmlType="submit" className="w-full h-10 ">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignUpForm;
