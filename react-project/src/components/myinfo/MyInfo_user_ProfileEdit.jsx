import React, { useState, useEffect } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    profilePicture: '/path/to/default_profile.jpg',
    nickname: '',
    name: '',
    email: '',
    birthday: ''
  });

  useEffect(() => {
    // Fetch user profile data from backend when component mounts
    const fetchUserProfile = async () => {
      try {
        // 세션 스토리지에서 이메일 가져오기
        const userEmail = sessionStorage.getItem('email');

        const response = await fetch(`/api/user-profile/${userEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        setProfile({
          profilePicture: userData.userProfile.profilePicture || '/path/to/default_profile.jpg',
          nickname: userData.userProfile.USER_NICK || '',
          name: userData.userProfile.USER_NAME || '',
          email: userData.userProfile.USER_EMAIL || '',
          birthday: userData.userProfile.USER_BIRTHDATE || '1990-01-01'
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []); // Run effect only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: profile.email,
            newNickname: profile.nickname
        })
    });

      const data = await response.json();
      console.log(data); // Log response from the server
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className='myinfo-container'>
      <Header />
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
          <label htmlFor='nickname'>닉네임</label>
          <input type='text' id='nickname' name='nickname' value={profile.nickname} onChange={handleChange} />
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
          <label htmlFor='birthday'>생년월일</label>
          <input type='date' id='birthday' name='birthday' value={profile.birthday} disabled />
        </div>
        <div className='profile-actions'>
          <button type='button' onClick={() => {}}>취소</button>
          <button type='submit'>변경</button>
        </div>
      </form>
      <div className='footer'>
        <Footer />
      </div>
    </div>
  );
};

export default ProfileEdit;