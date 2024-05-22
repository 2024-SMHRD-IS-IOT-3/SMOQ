import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "../../axios";
import { FaHeart, FaComment } from "react-icons/fa";
import { FaRegFaceGrin } from "react-icons/fa6";
import { IoCheckboxOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import "./journal.css";

const Journal_comment = () => {
  const { id } = useParams();
  const location = useLocation();
  const { writingUser } = location.state || {};
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axios.get(`/post/${id}`);
        if (res.data.success) {
          setPostData(res.data.post);
        } else {
          console.error("Failed to fetch post data");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/postcomments/${id}`);
        if (res.data.success) {
          setComments(res.data.comments);
          console.log(res.data.comments);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPostData();
    fetchComments();
  }, [id]);

  const handleWriteComment = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    const user = writingUser;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    console.log("comment", user, date);

    try {
      const res = await axios.post(`/post/${id}/comment`, {
        user,
        content: newComment,
        date,
      });

      if (res.data.success) {
        alert("작성되었습니다.");
        setComments([...comments, { user, content: newComment, date }]);
        setNewComment("");
        setShowCommentForm(false);
      } else {
        console.error("Failed to save comment");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="journal-container">
        {postData && (
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
                    <span className="user-name">{postData.user}</span>
                    <span className="user-icon2">
                      <IoCheckboxOutline />
                    </span>
                  </div>
                  <span className="post-date">{postData.date}</span>
                </div>
              </div>
            </div>
            <div className="journal-content">
              <p>{postData.content}</p>
            </div>
            <div className="journal-footer">
              <div className="journal-action">
                <FaHeart className="journalicon" />{" "}
                <span>{postData.likes}</span>
              </div>
              <div className="journal-action">
                <FaComment className="journalicon" />{" "}
                <span>{comments.length}</span>
              </div>
            </div>
          </div>
        )}
        <button className="writecomment" onClick={handleWriteComment}>
          댓글달기 <FaComment /> {comments.length}
        </button>
        {showCommentForm && (
          <div className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="댓글을 입력하세요."
            />
            <button onClick={handleCommentSubmit}>
              <FaArrowRight />
            </button>
          </div>
        )}
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <span className="comment-user">{comment.user}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Journal_comment;
