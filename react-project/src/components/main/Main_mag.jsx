import React, { useEffect, useState } from "react";
import Footermgr from "../footer/Footer_mgr";
import Header from "../header/Header";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const Main_mgr = () => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/all-users");
      if (response.data.success) {
        setUsers(response.data.users);
        setMessage("");
      } else {
        setUsers([]);
        setMessage("사용자 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("모든 사용자 정보 불러오기 실패:", error);
      setMessage("모든 사용자 정보 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUserSelect = async () => {
    try {
      const response = await axios.post("/find-user", { name, birthDate });
      if (response.data.success) {
        setUsers(response.data.users);
        setMessage("");
      } else {
        setUsers([]);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("사용자 검색 실패:", error);
      setMessage("사용자 검색 실패");
    }
  };

  const handleUserSelectManager = (selectedUser) => {
    navigate("/select_user_data", { state: { selectedUser } });
  };

  return (
    <div className="main-container">
      <Header />
      <div className="mgr-container">
        <div className="div-mgr-select">
          <h3 className="mrg-select">사용자 검색</h3>
        </div>
        <input
          type="text"
          placeholder="이름"
          className="inputmgr"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          className="inputmgr"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <div className="button-wrapper">
          <button className="btnselectmgr" onClick={handleUserSelect}>
            검색
          </button>
        </div>
        <div className="mgr-line"></div>
        {message && <div className="alert">{message}</div>}
        <table className="user-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>생년월일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.USER_NAME}</td>
                <td>{user.USER_BIRTHDATE}</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => handleUserSelectManager(user)}
                  >
                    조회하기
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="3">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <Footermgr />
      </div>
    </div>
  );
};

export default Main_mgr;
