// export default function HomePage() {
//     return <h1>Home</h1>;
// }

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

export default function HomePage() {
    return (
        <div className="max-w-lg space-y-6 p-10">
            <Input
                label="Email"
                placeholder="Enter your email"
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter password"
            />

            <Input
                label="Email"
                placeholder="Wrong email"
                error="Email is required"
            />

            <Textarea
                label="Description"
                placeholder="Describe your service..."
            />

            <Textarea
                label="Review"
                placeholder="Write your review..."
                error="Review is required"
            />

            <Button>Login</Button>
        </div>
    );
}