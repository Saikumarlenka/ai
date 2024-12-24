import React, { useState } from "react";
import { Tabs } from "antd";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpform";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { app } from "../firebase";


const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("signIn");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignIn = (values) => {
    console.log("Sign-In Submitted:", values);
    // Add your sign-in logic here
  };

  const handleSignUp = (values) => {
    console.log("Sign-Up Submitted:", values);
    // Add your sign-up logic here
  };

  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center">
<div className=" mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-6 w-4/12 !text-white">
      <Tabs
        className=""
        defaultActiveKey="signIn"
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: "signIn",
            label: <div   className={`px-9 py-3 text-white mb-3 rounded-3xl ${activeTab === 'signIn' ? 'bg-blue-700' : activeTab === 'signUp' ? 'bg-gray-600' : ''}`}
>Sign in</div>,
            children: (
              <>
                <SignInForm onSubmit={handleSignIn} />
                <GoogleSignInButton onGoogleSignIn={handleGoogleSignIn} />
              </>
            ),
          },
          {
            key: "signUp",
            label: <div className={`px-9 py-3 text-white mb-3 rounded-3xl ${activeTab === 'signUp' ? 'bg-blue-700' : activeTab === 'signIn' ? 'bg-gray-600' : ''}`}>Sign up</div>,
            children: (
              <>
                <SignUpForm onSubmit={handleSignUp} />
                <GoogleSignInButton onGoogleSignIn={handleGoogleSignIn} />
              </>
            ),
          },
        ]}
      />
    </div>
    </div>
    
  );
};

export default AuthTabs;
