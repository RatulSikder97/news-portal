import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ChevronDownIcon from "../components/icons/ChevronDownIcon";
import NewsIcon from "../components/icons/NewsIcon";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import type { User } from "../types";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/news");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
        setError("");
      } catch {
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    const selectedUser = users.find(
      (user) => user.id === Number(selectedUserId)
    );

    if (selectedUser) {
      login(selectedUser);
      navigate("/news");
    } else {
      setError("Invalid user selection");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-3">
              <NewsIcon />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">News Portal</h1>
          </div>

          {error && <ErrorAlert message={error} />}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* User Select */}
            <div>
              <label
                htmlFor="user-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select User
              </label>
              <div className="relative">
                <select
                  id="user-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
