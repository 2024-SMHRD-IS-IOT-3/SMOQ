import React, { useState } from "react";
import Header_mgr from "../header/Header_mgr";
import Footermgr from "../footer/Footer_mgr";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./myinfo.css";

const validatePassword = (password) => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

const PWEdit = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "newPassword") {
      if (!validatePassword(value)) {
        setPasswordError(
          "비밀번호는 최소 8자이며, 영문, 숫자, 특수문자를 포함해야 합니다."
        );
      } else {
        setPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== passwords.newPassword) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(passwords);
    const email = sessionStorage.getItem("email");
    console.log("res", email);
    if (passwordError || confirmPasswordError) {
      alert("입력한 비밀번호를 확인하세요.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post("/changePassword", {
        email: email,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      console.log("res", email);
      if (res.data.success) {
        console.log(res.data.success);
        alert("비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = "/main";
      } else {
        alert("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/MyInfo_mgr");
  };

  return (
    <div className="myinfo-container">
      <Header_mgr />
      <div className="myinfo-header">
        <h2>비밀번호 변경</h2>
      </div>
      <form onSubmit={handleSubmit} className="myinfo-body">
        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">변경할 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            onChange={handleChange}
            required
          />
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 재확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
        </div>
        {confirmPasswordError && (
          <p className="error">{confirmPasswordError}</p>
        )}
        <div className="profile-actions">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit">변경</button>
        </div>
      </form>
      <div className="footer">
        <Footermgr />
      </div>
    </div>
  );
};

export default PWEdit;
