import React, { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const PWEdit = () => {
  const [profile, setProfile] = useState({
    profilePicture: '/path/to/default_profile.jpg',
    nickname: '홍길동',
    name: '홍길동',
    email: 'user@example.com',
    birthday: '1990-01-01',
    password: '1234'
  });

  const handleChange = (e) => {
    const { password, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [password]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(profile);
  };

  return (
    <div className='myinfo-container'>
      <Header />
      <div className='myinfo-header'>
        <h2>비밀번호 변경</h2>
      </div>
      <form onSubmit={handleSubmit} className='myinfo-body'>
        <div className='form-group'>
          <label htmlFor='password'>현재 비밀번호</label>
          <input type='password' id='password1' name='password' onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>변경할 비밀번호</label>
          <input type='password' id='password2' name='password' onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>비밀번호 재확인</label>
          <input type='password' id='password3' name='password' onChange={handleChange} />
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

export default PWEdit;