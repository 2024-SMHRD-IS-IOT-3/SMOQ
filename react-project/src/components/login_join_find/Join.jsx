import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../axios";

const Join_user = () => {
  const { userTypeJoin } = useParams();
  const location = useLocation();
  const email = location.state?.email || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [smokeCount, setSmokeCount] = useState("");
  const [org, setOrg] = useState("");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validateConfirmPassword(newConfirmPassword);
  };

  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError(
        "비밀번호는 최소 8자이며, 영문, 숫자, 특수문자를 포함해야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const formatDateMMDDYYYY = (date) => {
    const [year, month, day] = date.split("-");
    console.log(year, month, day);
    return `${month}-${day}-${year}`;
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword || !name || !nickname || !birthDate) {
      alert("모든 필수 필드를 입력해주세요.");
      return;
    }
    if (!passwordError && !confirmPasswordError) {
      const formattedBirthDate = formatDateMMDDYYYY(birthDate);
      const submitData = {
        email,
        password,
        name,
        nickname,
        birthDate: formattedBirthDate,
        smokeCount: smokeCount || null,
      };

      axios
        .post("/joinDatauser", submitData)
        .then((res) => {
          if (res.data.result === "success") {
            alert("가입을 축하합니다");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("회원가입 실패:", error);
          alert("회원가입 실패");
        });
    } else {
      alert("비밀번호를 확인해주세요.");
    }
  };

  const handleSubmitManager = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword || !name || !org) {
      alert("모든 필수 필드를 입력해주세요.");
      return;
    }
    if (!passwordError && !confirmPasswordError) {
      const submitData = { email, password, name, org };

      axios
        .post("/joinDatamanager", submitData)
        .then((res) => {
          if (res.data.result === "success") {
            alert("가입을 축하합니다");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("회원가입 실패:", error);
          alert("회원가입 실패");
        });
    } else {
      alert("비밀번호를 확인해주세요.");
    }
  };

  return (
    <div>
      {userTypeJoin === "user" && (
        <div className="first-container">
          <h2 className="jointext">사용자 회원가입</h2>
          <div className="join-form">
            <div className="join-container">
              <h3>이메일*</h3>
              <input type="email" value={email} readOnly />
            </div>
            <div className="checkpw">
              <div className="join-container-check">
                <h3>비밀번호*</h3>
                <input
                  type="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={handlePasswordChange}
                  minLength="8"
                  required
                />
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <div className="checkpw">
              <div className="join-container-check">
                <h3>비밀번호 확인*</h3>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="비밀번호"
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {confirmPasswordError && (
                <p className="error">{confirmPasswordError}</p>
              )}
            </div>
            <div className="join-container">
              <h3>이름*</h3>
              <input
                type="text"
                value={name}
                placeholder="이름"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="join-container">
              <h3>닉네임*</h3>
              <input
                type="text"
                value={nickname}
                placeholder="닉네임"
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className="join-container">
              <h3>생년월일*</h3>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="join-container">
              <h3>하루 흡연 개수</h3>
              <input
                type="number"
                value={smokeCount}
                placeholder="하루 흡연 개수"
                onChange={(e) => setSmokeCount(e.target.value)}
              />
            </div>
            <div className="join-container-btn">
              <button
                type="submit"
                className="btnjoin"
                onClick={handleSubmitUser}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}

      {userTypeJoin === "manager" && (
        <div className="first-container">
          <h2 className="jointext">관리자 회원가입</h2>
          <div className="join-form">
            <div className="join-container">
              <h3>이메일*</h3>
              <input type="email" value={email} readOnly />
            </div>
            <div className="checkpw">
              <div className="join-container-check">
                <h3>비밀번호*</h3>
                <input
                  type="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={handlePasswordChange}
                  minLength="8"
                  required
                />
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <div className="checkpw">
              <div className="join-container-check">
                <h3>비밀번호 확인*</h3>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="비밀번호"
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {confirmPasswordError && (
                <p className="error">{confirmPasswordError}</p>
              )}
            </div>
            <div className="join-container">
              <h3>이름*</h3>
              <input
                type="text"
                value={name}
                placeholder="이름"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="join-container">
              <h3>소속기관*</h3>
              <input
                type="text"
                value={org}
                placeholder="소속기관"
                onChange={(e) => setOrg(e.target.value)}
                required
              />
            </div>
            <div className="join-container-btn">
              <button
                type="submit"
                className="btnjoin"
                onClick={handleSubmitManager}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Join_user;
