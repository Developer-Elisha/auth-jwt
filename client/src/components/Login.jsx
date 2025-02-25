import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (err) {
            setMessage("Invalid Credentials");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="bg-black border-white border p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-center text-2xl font-semibold text-white mb-4">Log in</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-3 rounded-lg bg-black border border-white text-white focus:outline-none" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-4 rounded-lg bg-black border border-white text-white focus:outline-none" />

                    <button type="submit" className="w-full p-3 rounded-lg bg-white text-black font-semibold">Log In</button>
                    {message && <p className="text-center text-red-400 mt-2">{message}</p>}
                </form>

                <p className="text-center text-gray-400 mt-4">
                    Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;