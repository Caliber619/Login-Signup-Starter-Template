import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore"
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                uid: user.uid,
            });

            navigate("/dashboard");
        } catch (error) {
            console.error("Signup Error:", error.message, error.code);
            alert(error.message);
        }
    };

    return (
        <div className="flex h-screen">
          {/* Left Side: Form */}
          <div className="w-1/2 flex flex-col justify-center items-center bg-white px-10">
            <h2 className="text-3xl font-semibold mb-2">Create an Account</h2>
            <p className="text-gray-500 mb-6">Sign up to get started</p>
      
            {/* Tabs */}
            <div className="flex mb-6">
              <button onClick={()=>navigate("/")}className="px-6 py-2 rounded-lg text-gray-500 hover:text-black transition duration-200">
                Sign In
              </button>
              <button className="px-6 py-2 rounded-lg bg-gray-100 text-black font-medium">
                Signup
              </button>
            </div>
      
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>

            {/* Input Fields */}
            <div className="w-full max-w-sm space-y-4">
              <input
                type="text"
                placeholder="UserName"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                onChange={(e) => setUsername(e.target.value)}
                />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                onChange={(e) => setEmail(e.target.value)}
                />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                onChange={(e) => setPassword(e.target.value)}
                />
      
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200">
                Sign Up
              </button>
            </div>
        </form>
      
            {/* Already have an account? */}
            <p className="text-gray-500 mt-6">
              Already have an account?{" "}
              <span onClick={()=>navigate("/")} className="text-blue-600 cursor-pointer hover:underline">
                Sign In
              </span>
            </p>
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

export default Signup;
