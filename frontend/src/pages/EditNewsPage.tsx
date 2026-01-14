import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  APP_TITLE_NAV,
  BTN_BACK,
  BTN_LOGOUT,
  BTN_UPDATE,
  EDIT_NEWS_TITLE,
  ERROR_BODY_MIN_LENGTH,
  ERROR_LOAD_NEWS_DETAIL,
  ERROR_TITLE_REQUIRED,
  ERROR_UPDATE_NEWS,
  LABEL_NEWS_CONTENT,
  LABEL_NEWS_TITLE,
  LOADING_NEWS_DETAIL,
  LOGGED_IN_AS,
  PLACEHOLDER_NEWS_CONTENT,
  PLACEHOLDER_NEWS_TITLE,
  UPDATING_NEWS,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { newsService } from "../services/newsService";
import type { News } from "../types";

const EditNewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [news, setNews] = useState<News | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) {
        setError("Invalid news ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const newsData = await newsService.getNewsById(id);

        // Check if logged-in user is the author
        if (user?._id !== newsData.author_id) {
          navigate("/news");
          return;
        }

        setNews(newsData);
        setTitle(newsData.title);
        setBody(newsData.body);
        setError("");
      } catch {
        setError(ERROR_LOAD_NEWS_DETAIL);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

    if (!news) return;

    try {
      setSubmitting(true);
      setError("");

      await newsService.updateNews(news._id, {
        title: title.trim(),
        body: body.trim(),
      });

      navigate(`/news/${news._id}`);
    } catch {
      setError(ERROR_UPDATE_NEWS);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/news/${id}`);
  };

  if (loading) {
    return <LoadingSpinner message={LOADING_NEWS_DETAIL} />;
  }

  if (error && !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <FaNewspaper className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {APP_TITLE_NAV}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {LOGGED_IN_AS}{" "}
                  <span className="font-medium">{user?.name}</span>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate("/news")}>
              {BTN_BACK}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const characterCount = body.length;
  const isValid = title.trim() && body.trim().length >= 20;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <FaNewspaper className="w-6 h-6 text-white" />
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
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {EDIT_NEWS_TITLE}
          </h2>

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
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={PLACEHOLDER_NEWS_TITLE}
                disabled={submitting}
                minLength={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
              />
            </div>

            {/* Body Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="body"
                  className="block text-sm font-semibold text-gray-700"
                >
                  {LABEL_NEWS_CONTENT}
                </label>
                <span
                  className={`text-sm ${characterCount < 20 ? "text-red-600" : "text-gray-500"
                    }`}
                >
                  {characterCount} characters
                  {characterCount < 20 && ` (minimum 20 required)`}
                </span>
              </div>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={PLACEHOLDER_NEWS_CONTENT}
                disabled={submitting}
                rows={12}
                minLength={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                Write at least 20 characters to create a meaningful news
                article.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !isValid}
              >
                {submitting ? UPDATING_NEWS : BTN_UPDATE}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditNewsPage;
