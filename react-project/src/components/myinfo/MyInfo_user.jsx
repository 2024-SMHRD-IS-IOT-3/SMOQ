import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "../../axios";
import "./myinfo.css";

const MyInfo_user = () => {
  const navigate = useNavigate();

  const handleProfileEdit = () => {
    navigate("/MyInfo_user_ProfileEdit");
  };

  const handlePWEdit = () => {
    navigate("/MyInfo_user_PWEdit");
  };

  const handleDevice = () => {
    navigate("/MyInfo_user_Device");
  };

  const handleFeedback = () => {
    navigate("/MyInfo_user_Feedback");
  };

  const handleResign = async () => {
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

  return (
    <div className="myinfo-container">
      <Header />
      <div className="myinfo-body">
        <p>기본정보</p>
        <button className="profile-button" onClick={handleProfileEdit}>
          프로필 변경
        </button>
        <button className="profile-button" onClick={handlePWEdit}>
          비밀번호 변경
        </button>
        <button className="profile-button" onClick={handleDevice}>
          등록 기기관리
        </button>
      </div>
      <div className="myinfo-body">
        <p>고객센터</p>
        <button className="profile-button" onClick={handleFeedback}>
          문의하기
        </button>
      </div>
      <div className="myinfo-body">
        <p>계정관리</p>
        <button className="profile-button">로그아웃</button>
        <button className="profile-button" onClick={handleResign}>
          회원 탈퇴
        </button>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default MyInfo_user;
