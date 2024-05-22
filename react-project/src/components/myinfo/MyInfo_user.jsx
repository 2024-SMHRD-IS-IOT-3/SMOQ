import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./myinfo.css";

const MyInfo_user = () => {
  const navigate = useNavigate();

  const handleProfileEdit = () => {
    navigate("/MyInfo_user_ProfileEdit");
  };

  const handlePWEdit = () => {
    navigate("/MyInfo_user_PWEdit");
  };

  // const handleDevice = () => {
  //   navigate("/MyInfo_user_Device");
  // };

  const handleFeedback = () => {
    navigate("/MyInfo_user_Feedback");
  };

  
  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      // Clear sessionStorage
      sessionStorage.clear();
      // Navigate to the '/' page
      navigate("/");
    }
  };

  const handleResign = () => {
    navigate("/MyInfo_user_Resign");
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
        {/* <button className="profile-button" onClick={handleDevice}>
          등록 기기관리
        </button> */}
      </div>
      <div className="myinfo-body">
        <p>고객센터</p>
        <button className="profile-button" onClick={handleFeedback}>
          문의하기
        </button>
      </div>
      <div className="myinfo-body">
        <p>계정관리</p>
        <button className="profile-button" onClick={handleLogout}>
          로그아웃
        </button>
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
