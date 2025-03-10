import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {motion} from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

return (
  <div className="flex h-screen">
    {/* Left Side: Form */}
    <div className="w-1/2 flex flex-col justify-center items-center bg-white px-10">
      <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-6">Please enter your details</p>

      {/* Tabs */}
      <div className="flex mb-6">
        <button onClick={()=>navigate("/")} className="px-6 py-2 rounded-lg bg-gray-100 text-black font-medium">
          Sign In
        </button>
        <button onClick={()=> navigate("/signup")} className="px-6 py-2 rounded-lg text-gray-500 hover:text-black transition duration-200">
          Signup
        </button>
      </div>



    <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>

      {/* Input Fields */}
      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
            onChange={(e)=> setEmail(e.target.value)}
            />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
            onChange={(e)=> setPassword(e.target.value)}
            />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200">
          Continue
        </button>
      </div>
    </form>

      {/* Social Logins */}
      <p className="text-gray-500 mt-6">Or Continue With</p>
      <div className="flex space-x-4 mt-4">
        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.1 }}
          className="p-3 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition"
        >
          <FcGoogle className="text-red-500 text-lg" />
        </motion.button>
        <motion.button
          onClick={handleFacebookLogin}
          whileHover={{ scale: 1.1 }}
          className="p-3 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition"
        >
          <FaFacebook className="text-blue-600 text-lg" />
        </motion.button>
      </div>
    </div>

    {/* Right Side: Illustration */}
    <div className="w-1/2 flex justify-center items-center bg-blue-50">
                  <motion.img
                    className="w-full h-auto"
                    src="src\assets\image2.jpg"
                    alt="Safe Box"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
    </div>
  </div>
);
};

export default Login;
