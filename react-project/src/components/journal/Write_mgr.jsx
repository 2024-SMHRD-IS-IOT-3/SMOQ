import React, { useState } from "react";
import Header from "../header/Header";
import axios from "../../axios";
import "./journal.css";
import { useLocation } from "react-router-dom";
import Footermgr from "../footer/Footer_mgr";

const Write = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [content, setContent] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleWritePost = async () => {
    console.log("handleWritePost");
    console.log(user);
    const email = sessionStorage.getItem("email");
    try {
      const res = await axios.post("/writepost", { content, email });
      console.log(res.data);
      if (res.data) {
        alert("작성되었습니다.");
        window.location.href = "/journal";
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="journal-container">
        <div className="div-write">
          <div className="writepost">
            <textarea
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={handleContentChange}
            />
          </div>
          <button className="btnwriteend" onClick={handleWritePost}>
            작성하기
          </button>
        </div>
      </div>
      <div className="footer">
        <Footermgr />
      </div>
    </div>
  );
};

export default Write;
