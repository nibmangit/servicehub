import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";

export default function LoginForm() {
    const navigate = useNavigate(); 
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        login();

        navigate("/dashboard");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
            />

            <div className="flex items-center justify-between">

                <Checkbox
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    label="Remember me"
                />

                <Link
                    to="/auth/forgot-password"
                    className="
                        text-sm
                        text-blue-600
                        hover:underline
                    "
                >
                    Forgot password?
                </Link>

            </div>

            <Button
                type="submit"
                className="w-full"
            >
                Login
            </Button>

            <p className="text-center text-sm text-slate-600">

                Don't have an account?{" "}

                <Link
                    to="/auth/register"
                    className="text-blue-600 hover:underline"
                >
                    Register
                </Link>

            </p>

        </form>
    );
}