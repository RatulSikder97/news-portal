import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ClockIcon from "../components/icons/ClockIcon";
import NewsIcon from "../components/icons/NewsIcon";
import {
  APP_TITLE_NAV,
  BTN_BACK,
  BTN_DELETE_NEWS,
  BTN_EDIT_NEWS,
  BTN_LOGOUT,
  BTN_POST_COMMENT,
  CONFIRM_DELETE_NEWS,
  ERROR_COMMENT_REQUIRED,
  ERROR_DELETE_NEWS,
  ERROR_LOAD_NEWS_DETAIL,
  ERROR_POST_COMMENT,
  LABEL_ADD_COMMENT,
  LABEL_AUTHOR,
  LABEL_PUBLISHED,
  LOADING_NEWS_DETAIL,
  LOGGED_IN_AS,
  NO_COMMENTS,
  PLACEHOLDER_COMMENT,
  SECTION_COMMENTS,
} from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { newsService } from "../services/newsService";
import type { Comment, News } from "../types";

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid news ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [newsData, commentsData] = await Promise.all([
          newsService.getNewsById(Number(id)),
          newsService.getCommentsByNewsId(Number(id)),
        ]);
        setNews(newsData);
        setComments(commentsData);
        setError("");
      } catch {
        setError(ERROR_LOAD_NEWS_DETAIL);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate("/news");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setCommentError(ERROR_COMMENT_REQUIRED);
      return;
    }

    if (!user || !news) return;

    try {
      setSubmittingComment(true);
      setCommentError("");

      const newComment: Comment = {
        id: Date.now(), // Temporary ID
        news_id: news.id,
        user_id: user.id,
        text: commentText.trim(),
        created_at: new Date().toISOString(),
      };

      // Update news with new comment using PATCH
      const updatedComments = [...news.comments, newComment];
      await newsService.updateNews(news.id, { comments: updatedComments });

      // Fetch updated comments with user data
      const commentsData = await newsService.getCommentsByNewsId(news.id);
      setComments(commentsData);

      // Update local news state
      setNews({ ...news, comments: updatedComments });

      // Clear form
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentError(ERROR_POST_COMMENT);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(CONFIRM_DELETE_NEWS)) return;

    if (!news) return;

    try {
      await newsService.deleteNews(news.id);
      navigate("/news");
    } catch (error) {
      console.error("Error deleting news:", error);
      setError(ERROR_DELETE_NEWS);
    }
  };

  const handleEdit = () => {
    navigate(`/news/${news?.id}/edit`);
  };

  if (loading) {
    return <LoadingSpinner message={LOADING_NEWS_DETAIL} />;
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <ErrorAlert message={error || ERROR_LOAD_NEWS_DETAIL} />
          <div className="mt-6">
            <Button variant="secondary" onClick={handleBack}>
              {BTN_BACK}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const author = news.author;

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
        <div className="mb-8 flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {BTN_BACK}
          </Button>

          {/* Edit and Delete buttons - only visible to author */}
          {user?.id === news.author_id && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleEdit}
                className="!w-auto"
              >
                {BTN_EDIT_NEWS}
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="!w-auto"
              >
                {BTN_DELETE_NEWS}
              </Button>
            </div>
          )}
        </div>

        {/* News Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-8 md:px-12 py-10">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {news.title}
            </h1>

            {/* Meta Info - Author and Date */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{LABEL_AUTHOR}</p>
                    <p className="font-semibold text-gray-900">{author.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{LABEL_PUBLISHED}</p>
                  <p className="text-sm text-gray-700">
                    {formatDate(news.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {news.body}
              </p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {SECTION_COMMENTS}
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>

          {/* Add Comment Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {LABEL_ADD_COMMENT}
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={PLACEHOLDER_COMMENT}
                  rows={4}
                  disabled={submittingComment}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {commentError && (
                  <p className="mt-2 text-sm text-red-600">{commentError}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingComment || !commentText.trim()}
                  className="!w-auto"
                >
                  {submittingComment ? "Posting..." : BTN_POST_COMMENT}
                </Button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">{NO_COMMENTS}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => {
                const commenter = comment.user;
                const commenterInitial = commenter
                  ? commenter.name.charAt(0).toUpperCase()
                  : "U";
                const commenterName = commenter?.name || "Unknown User";
                return (
                  <div
                    key={comment.id}
                    className="border-l-4 border-blue-500 bg-gray-50 rounded-r-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {commenterInitial}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">
                            {commenterName}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NewsDetailPage;
