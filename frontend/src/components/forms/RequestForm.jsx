import { useState } from "react";

import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

export default function RequestForm() {
    const [formData, setFormData] = useState({
        preferred_date: "",
        address: "",
        description: "",
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

        console.log(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <Input
                label="Preferred Date"
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
            />

            <Input
                label="Service Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
            />

            <Textarea
                label="Describe your request"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain exactly what you need..."
            />

            <Button
                type="submit"
                className="w-full"
            >
                Continue
            </Button>
        </form>
    );
}