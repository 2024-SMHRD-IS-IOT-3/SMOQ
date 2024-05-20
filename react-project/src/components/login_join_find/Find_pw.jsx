import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

const Find_pw = () => {
  const { userType } = useParams(); // URL 매개변수를 사용하여 userType을 읽습니다.

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmitUser = () => {
    axios.post('/send-userpw', { email, name, birthDate })
      .then(res => {
        if (res.data.success) {
          alert("임시 비밀번호가 발급되었습니다")
        } else {
          alert("입력한 정보를 다시 확인해주세요")
        }
      })
      .catch(error => {
        console.error('비밀번호 변경 실패:', error);
      });
  };

  const handleSubmitManager = () => {
    axios.post('/send-managerpw', { email, name, org })
      .then(res => {
        if (res.data.success) {
          alert("임시 비밀번호가 발급되었습니다")
        } else {
          alert("입력한 정보를 다시 확인해주세요")
        }
      })
      .catch(error => {
        console.error('비밀번호 변경 실패:', error);
      });
  };

  return (
    <div>
      {userType === 'user' && (
        <div className='first-container'>
          <h2 className='jointext'>사용자 비밀번호 변경</h2>
          <div className='join-form'>
            <div className='join-container'>
              <h3>이메일*</h3>
              <input type="email" value={email} placeholder='이메일' onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>이름*</h3>
              <input type="text" value={name} placeholder='이름' onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>생년월일*</h3>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            <div className='join-container-btn'>
              <button type="submit" className='btnjoin' onClick={handleSubmitUser}>비밀번호 변경</button>
            </div>
          </div>
        </div>
      )}

      {userType === 'manager' && (
        <div className='first-container'>
          <h2 className='jointext'>관리자 비밀번호 변경</h2>
          <div className='join-form'>
            <div className='join-container'>
              <h3>이메일*</h3>
              <input type="email" value={email} placeholder='이메일' onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>이름*</h3>
              <input type="text" value={name} placeholder='이름' onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>소속기관*</h3>
              <input type="text" value={org} placeholder='소속기관' onChange={(e) => setOrg(e.target.value)} required />
            </div>
            <div className='join-container-btn'>
              <button type="submit" className='btnjoin' onClick={handleSubmitManager}>비밀번호 변경</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Find_pw;
