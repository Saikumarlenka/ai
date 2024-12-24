import React from "react";
import { Button, Input, Form } from "antd";

const SignInForm = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit} className="space-y-4 w-9/12 mx-auto ">
    <Form.Item
  label={<span className=" !text-white">Email</span>}
  name="email"
  rules={[{ required: true, message: "Please enter your email!" }]}
>
  <Input
    placeholder="Enter your email"
    className="h-10 text-base border-none focus:ring-2 focus:ring-blue-500"
  />
</Form.Item>


      <Form.Item
        label={<span className="text-white">Password</span>}
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password placeholder="Enter your password" className="h-10"/>
      </Form.Item>
      <Button type="primary" htmlType="submit" className="w-full mb-3 h-10">
        Sign In
      </Button>
    </Form>
  );
};

export default SignInForm;
