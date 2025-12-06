import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NewsIcon from "../components/icons/NewsIcon";
import {
  APP_TITLE_NAV,
  BTN_CANCEL,
  BTN_LOGOUT,
  BTN_SUBMIT,
  CREATE_NEWS_TITLE,
  ERROR_BODY_MIN_LENGTH,
  ERROR_CREATE_NEWS,
  ERROR_TITLE_REQUIRED,
  LABEL_NEWS_CONTENT,
  LABEL_NEWS_TITLE,
  LOGGED_IN_AS,
  PLACEHOLDER_NEWS_CONTENT,
  PLACEHOLDER_NEWS_TITLE,
  SUBMITTING_NEWS,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { newsService } from "../services/newsService";

const CreateNewsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // States
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError(ERROR_TITLE_REQUIRED);
      return;
    }

    if (body.trim().length < 20) {
      setError(ERROR_BODY_MIN_LENGTH);
      return;
    }

    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await newsService.createNews({
        title: title.trim(),
        body: body.trim(),
        author_id: user.id,
        created_at: new Date().toISOString(),
      });

      // Redirect to news list page
      navigate("/news");
    } catch {
      setError(ERROR_CREATE_NEWS);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/news");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (submitting) {
    return <LoadingSpinner message={SUBMITTING_NEWS} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <NewsIcon />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {APP_TITLE_NAV}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {LOGGED_IN_AS} <span className="font-medium">{user?.name}</span>
              </span>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="!w-auto"
              >
                {BTN_LOGOUT}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {CREATE_NEWS_TITLE}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Share your news with the community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6">
              <ErrorAlert message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {LABEL_NEWS_TITLE}
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={PLACEHOLDER_NEWS_TITLE}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
                minLength={1}
              />
            </div>

            {/* Body Textarea */}
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {LABEL_NEWS_CONTENT}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-gray-500">
                (Minimum 20 characters required)
              </p>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={PLACEHOLDER_NEWS_CONTENT}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical transition"
                required
                minLength={20}
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {body.length} characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                {BTN_CANCEL}
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {BTN_SUBMIT}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateNewsPage;
