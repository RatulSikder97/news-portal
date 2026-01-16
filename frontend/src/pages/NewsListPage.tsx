import { useEffect, useState } from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaNewspaper,
    FaSearch,
} from "react-icons/fa";
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
import type { News, PaginatedResponse, User } from "../types";

const NewsListPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [paginatedNews, setPaginatedNews] =
        useState<PaginatedResponse<News> | null>(null);
    const [users, setUsers] = useState<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [limit] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [newsData, usersData] = await Promise.all([
                    newsService.getAllNews(currentPage, limit, searchQuery),
                    userService.getUsers(),
                ]);

                const usersMap = new Map(usersData.map((u) => [u._id, u]));
                setUsers(usersMap);
                setPaginatedNews(newsData);
                setError("");
            } catch {
                setError(ERROR_LOAD_NEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, limit, searchQuery]);

    const handleDelete = async (id: string) => {
        if (!confirm(CONFIRM_DELETE_NEWS)) return;

        try {
            await newsService.deleteNews(id);
            const [newsData] = await Promise.all([
                newsService.getAllNews(currentPage, limit, searchQuery),
            ]);
            setPaginatedNews(newsData);
        } catch {
            setError(ERROR_DELETE_NEWS);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const newsList = paginatedNews?.items || [];
    const totalPages = paginatedNews?.pages || 0;

    console.log(paginatedNews);

    if (loading) {
        return <LoadingSpinner message={LOADING_NEWS} />;
    }

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

                <div className="mb-6">
                    <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search news by title..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <Button type="submit" variant="primary" className="!w-auto px-6">
                            Search
                        </Button>
                    </form>
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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {newsList.map((news) => {
                                const author = users.get(news.author_id);
                                const isAuthor = user?._id === news.author_id;

                                return (
                                    <NewsCard
                                        key={news._id}
                                        news={news}
                                        authorName={author?.name}
                                        onView={(id) => navigate(`/news/${id}`)}
                                        onEdit={
                                            isAuthor
                                                ? (id) => navigate(`/news/${id}/edit`)
                                                : undefined
                                        }
                                        onDelete={isAuthor ? handleDelete : undefined}
                                    />
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded ${currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default NewsListPage;
