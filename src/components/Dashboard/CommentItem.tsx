import React from "react";
import { type Comment } from "../../types/workspace";
import { NotebookPen } from "lucide-react";
import useTimezone from "../../hooks/useTimezone";

interface CommentItemProps {
  comment: Comment | null;
  index: number;
}

const colorArray = ["from-indigo-500", "from-amber-500"];

const CommentItem: React.FC<CommentItemProps> = ({ comment, index }) => {
  const { formatDate } = useTimezone();

  return (
    <div className="flex space-x-3">
      <div
        className={`w-8 h-8 bg-gradient-to-r ${
          colorArray[index % colorArray.length]
        } to-neon-fuchsia rounded-full flex-shrink-0 flex justify-center items-center`}
      >
        <NotebookPen className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-black/10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium dark:text-white text-black text-sm">
              {comment?.authorId?.name}
            </span>
            <span className="text-xs dark:text-gray-400 text-gray-800">
              {formatDate(comment?.createdAt || new Date()).split("/")[1]}
            </span>
          </div>
          <p className="text-sm dark:text-gray-300 text-gray-700">
            {comment?.body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
