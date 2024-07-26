import React from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";

const Comment = ({ name, comment, image, onDeleteComment, commentId }) => {
  return (
    <div className="flex items-center mt-2 w-full relative">
      <div className="mx-2">
        <Avatar
          size="sm"
          alt="avatar"
          variant="circular"
          src={image || avatar}
        ></Avatar>
      </div>
      <div className="flex flex-col items-start bg-gray-100 rounded-2xl p-1 max-w-[600px] w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <p className="font-roboto text-black text-sm no-underline tracking-normal leading-none p-1 font-medium">
              {name}
            </p>
            <p className="font-roboto text-black text-sm no-underline tracking-normal leading-none p-1">
              {comment}
            </p>
          </div>
          {onDeleteComment && (
            <button
              className="text-red-500 hover:text-red-700 ml-2 self-start"
              onClick={() => onDeleteComment(commentId)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
