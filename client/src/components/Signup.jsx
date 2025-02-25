import React, { useState } from "react";
import { registerUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (image) data.append("profilePic", image);

        try {
            const res = await registerUser(data);
            if (res.status === 200 || res.status === 201) {
                setMessage("Signup successful!");
                navigate("/");
            } else {
                setMessage(res.data.error || "Unknown error occurred.");
            }
        } catch (err) {
            setMessage(err.response?.data?.error || "Error signing up.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="bg-black border-white border p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-center text-2xl font-semibold text-white mb-4">Create an account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4">
                        <label className="w-20 h-20 bg-black border border-white rounded-full flex justify-center items-center cursor-pointer overflow-hidden">
                            <input type="file" className="hidden" onChange={handleImageChange} />
                            {image ? <img src={URL.createObjectURL(image)} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <span className="text-white text-2xl">+</span>}
                        </label>
                    </div>

                    <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-3 mb-3 rounded-lg bg-black border border-white text-white focus:outline-none" />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-3 rounded-lg bg-black border border-white text-white focus:outline-none" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-4 rounded-lg bg-black border border-white text-white focus:outline-none" />

                    <button type="submit" className="w-full p-3 rounded-lg bg-white text-black font-semibold">Create Account</button>
                    {message && <p className="text-center text-red-400 mt-2">{message}</p>}
                </form>

                <p className="text-center text-gray-400 mt-4">
                    Already have an account? <Link to="/" className="text-white hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
