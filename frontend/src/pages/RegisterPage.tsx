import { useEffect, useState } from "react";
import { SiSimplelogin } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import { APP_NAME } from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";

const RegisterPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/news", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await userService.register({ name, email, password });
            // Redirect to login after successful registration
            navigate("/login", { state: { message: "Registration successful! Please login." } });
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="text-[10rem] font-black text-gray-400 opacity-10 select-none transform whitespace-nowrap">
                    {APP_NAME}
                </div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <SiSimplelogin className="w-8 h-8 text-gray-600 mx-auto" />
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-gray-600 leading-relaxed">
                            Join to access the news portal
                        </p>
                    </div>

                    {error && (
                        <div className="animate-fadeIn">
                            <ErrorAlert message={error} />
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-base font-semibold rounded-lg transition-all duration-200"
                            disabled={submitting}
                        >
                            {submitting ? "Signing up..." : "Register"}
                        </Button>

                        <div className="text-center mt-4 text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
