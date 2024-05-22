import React from "react";
import { useNavigate } from "react-router-dom";
import Header_mgr from "../header/Header_mgr";
import Footermgr from "../footer/Footer_mgr";
import "./myinfo.css";
import axios from "../../axios";

const MyInfo_mgr = () => {
  const navigate = useNavigate();

  const handleProfileEdit = () => {
    navigate("/MyInfo_mgr_ProfileEdit");
  };

  const handlePWEdit = () => {
    navigate("/MyInfo_mgr_PWEdit");
  };

  const handleDevice = () => {
    navigate("/MyInfo_mgr_user");
  };

  const handleFeedback = () => {
    navigate("/MyInfo_mgr_Feedback");
  };

  const handleResign = async () => {
    try {
      const email = sessionStorage.getItem("email");
      const response = await axios.post("/resign", { email });

      if (response.data.success) {
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

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      // Clear sessionStorage
      sessionStorage.clear();
      // Navigate to the '/' page
      navigate("/");
    }
  };

  return (
    <div className="myinfo-container">
      <Header_mgr/>
        <div className='myinfo-body'>
          <p>기본정보</p>
          <button className='profile-button' onClick={handleProfileEdit}>프로필 변경</button>
          <button className='profile-button' onClick={handlePWEdit}>비밀번호 변경</button>
          <button className='profile-button' onClick={handleDevice}>등록 사용자 관리</button>
        </div>
        <div className='myinfo-body'>
          <p>고객센터</p>
          <button className='profile-button' onClick={handleFeedback}>문의하기</button>
        </div>
        <div className='myinfo-body'>
          <p>계정관리</p>
          <button className='profile-button' onClick={handleLogout}>로그아웃</button>
          <button className='profile-button' onClick={handleResign}>회원 탈퇴</button>
        </div>
      <div className='footer'>
        <Footermgr />
      </div>
    </div>
  );
};

export default MyInfo_mgr;
