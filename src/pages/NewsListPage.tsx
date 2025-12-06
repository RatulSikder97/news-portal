import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NewsCard from "../components/common/NewsCard";
import {
  APP_TITLE_NAV,
  BTN_CREATE_NEWS,
  BTN_LOGOUT,
  CONFIRM_DELETE_NEWS,
  ERROR_DELETE_NEWS,
  ERROR_LOAD_NEWS,
  LOADING_NEWS,
  LOGGED_IN_AS,
  NEWS_LIST_TITLE,
  NO_NEWS_FOUND,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { newsService } from "../services/newsService";
import { userService } from "../services/userService";
import type { News, User } from "../types";

const NewsListPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [users, setUsers] = useState<Map<number, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsData, usersData] = await Promise.all([
          newsService.getAllNews(),
          userService.getUsers(),
        ]);

        console.log(usersData);

        const usersMap = new Map(usersData.map((u) => [Number(u.id), u]));
        setUsers(usersMap);
        setNewsList(newsData);
        setError("");
      } catch {
        setError(ERROR_LOAD_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(CONFIRM_DELETE_NEWS)) return;

    try {
      await newsService.deleteNews(id);
      setNewsList(newsList.filter((news) => news.id !== id));
    } catch {
      setError(ERROR_DELETE_NEWS);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <LoadingSpinner message={LOADING_NEWS} />;
  }

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {NEWS_LIST_TITLE}
          </h2>
          <Button
            variant="primary"
            onClick={() => navigate("/news/create")}
            className="!w-auto"
          >
            {BTN_CREATE_NEWS}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {newsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{NO_NEWS_FOUND}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsList.map((news) => {
              const author = users.get(news.author_id);
              const isAuthor = user?.id == news.author_id;

              return (
                <NewsCard
                  key={news.id}
                  news={news}
                  authorName={author?.name}
                  onView={(id) => navigate(`/news/${id}`)}
                  onEdit={
                    isAuthor ? (id) => navigate(`/news/${id}/edit`) : undefined
                  }
                  onDelete={isAuthor ? handleDelete : undefined}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsListPage;
