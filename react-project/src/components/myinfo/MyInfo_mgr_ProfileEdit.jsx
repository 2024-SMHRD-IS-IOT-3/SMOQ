import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import Header_mgr from '../header/Header_mgr';
import Footermgr from '../footer/Footer_mgr';
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    profilePicture: '/path/to/default_profile.jpg',
    name: '',
    email: '',
    birthday: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const email = sessionStorage.getItem("email");
      try {    
        const response = await axios.post('/mgr-profile', { email });
        const mgrData = response.data.mgrProfile;

        setProfile({
          profilePicture: mgrData.profilePicture || '/path/to/default_profile.jpg',
          name: mgrData.MGR_NAME || '',
          email: mgrData.MGR_EMAIL || '',
          org:  mgrData.MGR_ORG || ''
        });
      } catch (error) {
        console.error('Failed to fetch mgr profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCancel = () => {
    navigate("/MyInfo_mgr");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const res = await axios.post('/update-profile', {
        email: profile.email,
        newNickname: profile.nickname
      });

      console.log(res.data); // 서버 응답 로그
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className='myinfo-container'>
      <Header_mgr />
      <div className='myinfo-header'>
        <h2>프로필 변경</h2>
      </div>
      <form onSubmit={handleSubmit} className='myinfo-body'>
        <div className='form-group'>
          <label htmlFor='profilePicture'>프로필 사진</label>
          <div className='profile-image-section'>
            <img src={profile.profilePicture} alt="Profile" className='profile-image' />
              <br></br>
              <button type='button'>변경</button>
              <button type='button'>삭제</button>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='email'>이메일</label>
          <input type='text' id='email' name='email' value={profile.email} disabled />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>이름</label>
          <input type='text' id='name' name='name' value={profile.name} disabled />
        </div>
        <div className='form-group'>
          <label htmlFor='org'>소속기관</label>
          <input type='text' id='org' name='org' value={profile.org} disabled />
        </div>
        <div className='profile-actions'>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type='submit'>변경</button>
        </div>
      </form>
      <div className='footer'>
        <Footermgr />
      </div>
    </div>
  );
};

export default ProfileEdit;