import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import React, { useState } from "react";

const Join_first = () => {
  const { userType } = useParams();
  const [email, setEmail] = useState("");
  const [authcode, setAuthcode] = useState("");
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = () => {
    console.log("handleSendmail", email);

    axios
      .post("/send-email", { email }, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.code);
          setShowAuthInput(true);
          setShowEmailInput(false);
        } else {
          alert("중복된 이메일입니다.");
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("발송 실패");
      });
  };

  const handleAuthCodeChange = (e) => {
    setAuthcode(e.target.value);
  };

  const handleVerifyAuthCodeUser = () => {
    axios
      .post("/sendcode", { authcode }, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (res.data["message"] == "success") {
          alert("인증되었습니다.");

          navigate("/join/user", { state: { email } });
        } else {
          alert("인증 실패.");
        }
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        alert("인증 실패");
      });
  };

  const handleVerifyAuthCodeManager = () => {
    axios
      .post("/sendcode", { authcode }, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (res.data["message"] == "success") {
          alert("인증되었습니다.");
          navigate("/join/manager", { state: { email } });
        } else {
          alert("인증 실패.");
        }
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        alert("인증 실패");
      });
  };

  return (
    <div>
      {userType === "user" && (
        <div className="join">
          <div className="first-container">
            <div className="div-first-title">
              <h2 className="first-title">사용자 회원가입</h2>
            </div>
            <h3 className="joinemail">이메일을 입력해주세요</h3>
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
            <p className="join-email">입력하신 이메일은 아이디로 사용됩니다.</p>
            {showEmailInput && (
              <>
                <button className="sendbtn" onClick={handleSendEmail}>
                  이메일로 코드 발송
                </button>
              </>
            )}
            {showAuthInput && (
              <>
                <input
                  type="text"
                  placeholder="인증코드"
                  id="authcode"
                  value={authcode}
                  onChange={handleAuthCodeChange}
                />
                <div className="btn-auth">
                  <button
                    className="authbtn"
                    onClick={handleVerifyAuthCodeUser}
                  >
                    인증하기
                  </button>
                  <button className="authbtn" onClick={handleSendEmail}>
                    인증번호 재전송
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {userType === "manager" && (
        <div className="join">
          <div className="first-container">
            <div className="div-first-title">
              <h2 className="first-title">관리자 회원가입</h2>
            </div>
            <h3 className="joinemail">이메일을 입력해주세요</h3>
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
            <p className="join-email">입력하신 이메일은 아이디로 사용됩니다.</p>
            {showEmailInput && (
              <>
                <button className="sendbtn" onClick={handleSendEmail}>
                  이메일로 코드 발송
                </button>
              </>
            )}
            {showAuthInput && (
              <>
                <input
                  type="text"
                  placeholder="인증코드"
                  id="authcode"
                  value={authcode}
                  onChange={handleAuthCodeChange}
                />
                <div className="btn-auth">
                  <button
                    className="authbtn"
                    onClick={handleVerifyAuthCodeManager}
                  >
                    인증하기
                  </button>
                  <button className="authbtn" onClick={handleSendEmail}>
                    인증번호 재전송
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Join_first;
