import React, { useState } from "react";
import Header from "../header/Header";
import Footermgr from "../footer/Footer_mgr";
import { useNavigate } from "react-router-dom";
import "./myinfo.css";

const Device = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { id: 1, deviceid: "lq2w3e4r", devicename: "SMOQ", signupDate: "24/05/06" },
    // Add more users as needed
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/MyInfo_user");
  };

  return (
    <div className="myinfo-container">
      <Header />
      <div className="myinfo-header">
        <h2>등록 사용자 관리</h2>
      </div>
      <div className="device-content">
        <div className="search-section">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="이메일 입력"
          />
          <button>등록</button>
        </div>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.deviceid}</td>
                <td>{user.devicename}</td>
                <td>{user.signupDate}</td>
                <td>
                  <button>해제</button>
                </td>
              </tr>
            ))}
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
};

export default Device;
