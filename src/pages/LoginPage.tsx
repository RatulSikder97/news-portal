import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { SiSimplelogin } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  APP_NAME,
  BTN_LOGIN,
  ERROR_INVALID_USER,
  ERROR_LOAD_USERS,
  ERROR_SELECT_USER,
  LABEL_SELECT_USER_PLACEHOLDER,
  LOADING_USERS,
  LOGIN_PAGE_TITLE,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import type { User } from "../types";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/news", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
        setError("");
      } catch {
        setError(ERROR_LOAD_USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError(ERROR_SELECT_USER);
      return;
    }

    const selectedUser = users.find((user) => user.id == +selectedUserId);

    if (!selectedUser) {
      setError(ERROR_INVALID_USER);
      return;
    }

    setSubmitting(true);
    try {
      login(selectedUser);
      navigate("/news", { replace: true });
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message={LOADING_USERS} />
      </div>
    );
  }

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
              Select your user account to access the news portal
            </p>
          </div>

          {error && (
            <div className="animate-fadeIn">
              <ErrorAlert message={error} />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <select
                  id="user"
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all duration-200"
                  required
                  disabled={submitting}
                >
                  <option value="">{LABEL_SELECT_USER_PLACEHOLDER}</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <FaChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base font-semibold rounded-lg transition-all duration-200"
              disabled={submitting || !selectedUserId}
            >
              {submitting ? "Signing in..." : BTN_LOGIN}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
