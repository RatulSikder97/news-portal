import { FaClock, FaEdit, FaEye, FaTrash, FaUser } from "react-icons/fa";
import { GiChatBubble } from "react-icons/gi";
import type { News } from "../../types";
import Button from "./Button";

interface NewsCardProps {
  news: News;
  authorName?: string;
  onView?: (newsId: number) => void;
  onEdit?: (newsId: number) => void;
  onDelete?: (newsId: number) => void;
  showActions?: boolean;
}

const NewsCard = ({
  news,
  authorName,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{news.title}</h2>
        <div className="flex items-center gap-4">
          {authorName && (
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <FaUser className="w-4 h-4" />
              <span className="font-medium">{authorName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaClock className="w-4 h-4" />
            <span>{formatDate(news.created_at)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <GiChatBubble className="w-4 h-4" />
            <span>{news.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">{news.body}</p>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-end items-center gap-2 pt-4 mt-auto border-t border-gray-200">
          {onView && (
            <Button
              variant="primary"
              onClick={() => onView(news.id)}
              className="flex items-center justify-center gap-2"
            >
              <FaEye className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(news.id)}
              className="flex items-center justify-center gap-2"
            >
              <FaEdit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={() => onDelete(news.id)}
              className="flex items-center justify-center gap-2"
            >
              <FaTrash className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsCard;
