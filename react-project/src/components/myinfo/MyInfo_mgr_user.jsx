import React, { useState, useEffect } from "react";
import Header_mgr from "../header/Header_mgr";
import Footermgr from "../footer/Footer_mgr";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import "./myinfo.css";

function User() {
  const [managedUsers, setManagedUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagedUsers();
  }, []);

  const fetchManagedUsers = async () => {
    const mgremail = sessionStorage.getItem("email");
    console.log("mgr", mgremail); // 매니저 이메일 확인용 로그
    try {
      const response = await axios.post("/managed-users", { mgremail });
      console.log("Response from server:", response); // 서버 응답 확인용 로그
      if (response.data.success) {
        setManagedUsers(response.data.managedUsers);
        setMessage("");
      } else {
        setManagedUsers([]);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("관리 중인 사용자 정보를 불러오는데 실패했습니다:", error);
      setMessage("관리 중인 사용자 정보를 불러오는데 실패했습니다");
    }
  };

  const handleNewUserEmailChange = (event) => {
    setNewUserEmail(event.target.value);
  };

  const handleAddUser = async () => {
    const mgremail = sessionStorage.getItem("email");
    console.log("Adding user with manager email:", mgremail); // Logging
    console.log("Adding new user email:", newUserEmail); // Logging
    try {
      const response = await axios.post("/add-user", { mgremail, userEmail: newUserEmail });
      console.log("Result from server:", response.data);
      if (response.data.success) {
        alert('유저를 등록했습니다');
        fetchManagedUsers();
        setNewUserEmail("");
      } else {
        console.error("사용자 추가 실패:", response.data.message);
        setMessage("사용자 추가 실패");
      }
    } catch (error) {
      console.error("사용자 추가 실패:", error);
      setMessage("사용자 추가 실패");
    }
  };

  const handleDeleteUser = async (userEmail) => {
    console.log("Deleting user with email:", userEmail); // Logging
    const mgrId = sessionStorage.getItem("email");
    console.log("Manager ID:", mgrId); // Logging
    try {
      const response = await axios.post("/delete-user", { mgrId, userEmail });
      console.log("Response from server:", response); // Logging
      if (response.data.success) {
        fetchManagedUsers();
      } else {
        console.error("사용자 삭제 실패:", response.data.message);
        setMessage("사용자 삭제 실패");
      }
    } catch (error) {
      console.error("사용자 삭제 실패:", error);
      setMessage("사용자 삭제 실패");
    }
  };

  const handleCancel = () => {
    navigate("/MyInfo_mgr");
  };

  return (
    <div className="myinfo-container">
      <Header_mgr />
      <div className="myinfo-header">
        <h2>등록 사용자 관리</h2>
      </div>
      <div className="device-content">
        <div className="add-user-section">
          <input
            type="email"
            value={newUserEmail}
            onChange={handleNewUserEmailChange}
            placeholder="신규 사용자의 이메일을 입력하세요"
          />
          <button onClick={handleAddUser}>추가</button>
        </div>
        {message && <div className="alert">{message}</div>}
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>생년월일</th>
              <th>등록일자</th>
              <th>등록해제</th>
            </tr>
          </thead>
          <tbody>
            {managedUsers.length > 0 ? (
              managedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.USER_NAME}</td>
                  <td>{user.USER_BIRTHDATE}</td>
                  <td>{user.JOINED_AT}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.USER_EMAIL)}>삭제</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">등록된 사용자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="profile-actions">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
      <div className="footer">
        <Footermgr />
      </div>
    </div>
  );
}

export default User;