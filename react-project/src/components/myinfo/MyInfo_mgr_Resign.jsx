import React, { useState } from "react";
import Header_mgr from "../header/Header_mgr";
import Footer_mgr from "../footer/Footer_mgr";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./myinfo.css";

const Resign = () => {
  const [feedback, setFeedback] = useState({
    category: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback({
      ...feedback,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted feedback:", feedback);

    try {
      const res = await axios.post("/sendFeedback", feedback);
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("전송 에러");
    }
    // 
    try {
      const email = sessionStorage.getItem("email");
      console.log(email);
      const response = await axios.post("/resign", { email });

      if (response.data.success) {
        console.log("ab");
        sessionStorage.removeItem("email");
        alert("회원 탈퇴가 성공적으로 처리되었습니다.");
        navigate("/");
      } else {
        alert("회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error resigning:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/MyInfo_mgr");
  };

  return (
    <div className="myinfo-container">
      <Header_mgr />
      <div className="myinfo-header">
        <h2>회원탈퇴</h2>
      </div>
      <div className="myinfo-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">탈퇴사유</label>
            <select
              id="category"
              name="category"
              value={feedback.category}
              onChange={handleInputChange}
            >
              <option value="">선택하세요</option>
              <option value="서비스">서비스</option>
              <option value="제품">제품</option>
              <option value="지원">지원</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">내용을 입력하세요</label>
            <textarea
              id="message"
              name="message"
              value={feedback.message}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-actions">
            <button type="button" onClick={handleCancel}>
              취소
            </button>
            <button type="submit">탈퇴하기</button>
          </div>
        </form>
      </div>
      <div className="footer">
        <Footer_mgr />
      </div>
    </div>
  );
};

export default Resign;
