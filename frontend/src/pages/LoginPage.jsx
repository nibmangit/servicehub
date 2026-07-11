import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-blue-600">
                        ServiceHub
                    </h1>

                    <h2 className="mt-6 text-2xl font-semibold">
                        Welcome Back
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Sign in to your account
                    </p>

                </div>

                <LoginForm />

            </div>

        </div>
    );
}