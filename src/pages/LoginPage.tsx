import { useEffect, useState } from "react";
import { SiSimplelogin } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import {
  APP_NAME,
  BTN_LOGIN,
  LOGIN_PAGE_TITLE,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await login({ email, password });
      navigate("/news", { replace: true });
    } catch {
      setError("Login failed. Invalid email or password.");
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
              {LOGIN_PAGE_TITLE}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="animate-fadeIn">
              <ErrorAlert message={error} />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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
                  placeholder="Enter your password"
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
              {submitting ? "Signing in..." : BTN_LOGIN}
            </Button>

            {/* Hardcoded demo credentials hint (optional, can be removed) */}
            <div className="text-sm text-gray-500 text-center mt-4">
              <p>Demo Credentials:</p>
              <p>Email: john@example.com</p>
              <p>Password: Pass1234</p>
            </div>

            <div className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
