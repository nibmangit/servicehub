import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function RegisterForm() {
    const navigate = useNavigate(); 
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role: "customer",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        register();

        navigate("/dashboard");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
            />

            <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
            />

            <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+2519..."
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
            />

            <Input
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
            />

            <Select
                label="Account Type"
                name="role"
                value={formData.role}
                onChange={handleChange}
            >
                <option value="customer">
                    Customer
                </option>

                <option value="provider">
                    Service Provider
                </option>
            </Select>

            <Button
                type="submit"
                className="w-full"
            >
                Create Account
            </Button>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}

                <Link
                    to="/auth/login"
                    className="text-blue-600 hover:underline"
                >
                    Login
                </Link>
            </p>
        </form>
    );
}