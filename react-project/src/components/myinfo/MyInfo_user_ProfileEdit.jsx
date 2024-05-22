import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    profilePicture: "/path/to/default_profile.jpg",
    nickname: "",
    name: "",
    email: "",
    birthday: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const email = sessionStorage.getItem("email");
      try {
        const response = await axios.post("/user-profile", { email });
        const userData = response.data.userProfile;

        // Format the date from "20-DEC-97" to "1997-12-20"
        const formattedBirthday = new Date(userData.USER_BIRTHDATE)
          .toISOString()
          .split("T")[0];

        setProfile({
          profilePicture:
            userData.profilePicture || "/path/to/default_profile.jpg",
          nickname: userData.USER_NICK || "",
          name: userData.USER_NAME || "",
          email: userData.USER_EMAIL || "",
          birthday: formattedBirthday,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/MyInfo_user");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("/update-profile", {
        email: profile.email,
        newNickname: profile.nickname,
      });

      console.log(res.data); // 서버 응답 로그
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="myinfo-container">
      <Header />
      <div className="myinfo-header">
        <h2>프로필 변경</h2>
      </div>
      <form onSubmit={handleSubmit} className="myinfo-body">
        <div className="form-group">
          <label htmlFor="profilePicture">프로필 사진</label>
          <div className="profile-image-section">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="profile-image"
            />
            <br></br>
            <button type="button">변경</button>
            <button type="button">삭제</button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            className="myinput"
            type="text"
            id="nickname"
            name="nickname"
            value={profile.nickname}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            className="myinput"
            type="text"
            id="email"
            name="email"
            value={profile.email}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            className="myinput"
            type="text"
            id="name"
            name="name"
            value={profile.name}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthday">생년월일</label>
          <input
            className="myinput"
            type="date"
            id="birthday"
            name="birthday"
            value={profile.birthday}
            disabled
          />
        </div>
        <div className="profile-actions">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit">변경</button>
        </div>
      </form>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default ProfileEdit;
