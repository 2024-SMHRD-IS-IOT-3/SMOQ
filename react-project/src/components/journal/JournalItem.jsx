import React, { useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { FaRegFaceGrin } from "react-icons/fa6";
import { IoCheckboxOutline } from "react-icons/io5";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const JournalItem = ({
  id,
  user,
  date,
  content,
  initialLikes,
  comments,
  writingUser,
}) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const navigate = useNavigate();

  const handlePostLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    console.log("id", id);
    console.log("user", user);
    console.log("date", date);
    console.log("content", content);
    console.log("initialLikes", initialLikes);
    console.log("comments", comments);
    console.log("writingUser", writingUser);

    try {
      const response = await axios.post("/update-like", { postId: id });
      if (response.data.success) {
        setLikes(likes + 1);
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handlePostComment = () => {
    navigate(`/journal_comment/${id}`, { state: { writingUser } });
  };

  return (
    <div className="journal-item">
      <div className="journal-header">
        <div className="user-info">
          <div>
            <span className="user-icon">
              <FaRegFaceGrin />
            </span>
          </div>
          <div className="user-date">
            <div className="user-data">
              <span className="user-name">{user}</span>
              <span className="user-icon2">
                <IoCheckboxOutline />
              </span>
            </div>
            <span className="post-date">{date}</span>
          </div>
        </div>
      </div>
      <div className="journal-content">
        <p>{content}</p>
      </div>
      <div className="journal-footer">
        <div className="journal-action" onClick={handlePostLike}>
          <FaHeart className="journalicon" /> <span>{likes}</span>
        </div>
        <div className="journal-action" onClick={handlePostComment}>
          <FaComment className="journalicon" /> <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default JournalItem;
