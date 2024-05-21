import React, { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "../../axios";
import "./journal.css";

const Write = () => {
  const [content, setContent] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleWritePost = async () => {
    console.log("handleWritePost");
    try {
      const res = await axios.post("/writepost", { content });
      console.log(res.data);
      if (res.data) {
        alert("작성되었습니다.");
        window.location.href = "/journal_mgr";
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
        <Footer />
      </div>
    </div>
  );
};

export default Write;
