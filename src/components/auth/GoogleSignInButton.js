import React from "react";
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const GoogleSignInButton = ({ onGoogleSignIn }) => {
  return (
    <div className="text-center ">
      <Button
        type="default"
        className="flex items-center justify-center w-9/12 mx-auto m-3 h-10 border-gray-300 !bg-white "
        icon={<GoogleOutlined />}
        onClick={onGoogleSignIn}
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default GoogleSignInButton;
