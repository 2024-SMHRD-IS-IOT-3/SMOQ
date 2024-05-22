import React, { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    profilePicture: '/path/to/default_profile.jpg',
    nickname: '홍길동',
    name: '홍길동',
    email: 'user@example.com',
    birthday: '1990-01-01'
  });

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
          // Include other fields to update here if needed
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