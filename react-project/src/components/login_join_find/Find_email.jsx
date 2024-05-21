import axios from '../../axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';


const Find_email = () => {
  const { userType } = useParams(); 

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('')

  const handleSubmitUser = () => {
    axios.post('/find-useremail', { name, birthDate })
      .then(res => {
        if (res.data.success) {
          setEmail(res.data.email);
          setMessage('');
        } else {
          setEmail('');
          setMessage(res.data.message);
        }
      })
      .catch(error => {
        console.error('이메일 찾기 실패:', error);
        setMessage('이메일 찾기 실패');
      });
  };

  const handleSubmitManager = () => {
    axios.post('/find-manageremail', { name, org })
      .then(res => {
        if (res.data.success) {
          setEmail(res.data.email);
          setMessage('');
          console.log("success")
        } else {
          setEmail('');
          setMessage(res.data.message);
        }
      })
      .catch(error => {
        console.error('이메일 찾기 실패:', error);
        setMessage('이메일 찾기 실패');
      });
  };


  return (
    <div>
      {userType === 'user' && (
        <div className='first-container'>
          <h2 className='jointext'>사용자 이메일 찾기</h2>
          <div className='join-form'>
            <div className='join-container'>
              <h3>이름</h3>
              <input type="text" value={name} placeholder='이름' onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>생년월일</h3>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            <div className='join-container-btn'>
              <button type="submit" className='btnjoin' onClick={handleSubmitUser}>이메일 찾기</button>
            </div>
            {email && (
              <div className='result'>
                <h3>이메일:</h3>
                <p>{email}</p>
              </div>
            )}
            {message && (
              <div className='finderror'>
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {userType === 'manager' && (
        <div className='first-container'>
          <h2 className='jointext'>관리자 이메일 찾기</h2>
          <div className='join-form'>
            <div className='join-container'>
              <h3>이름</h3>
              <input type="text" value={name} placeholder='이름' onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='join-container'>
              <h3>소속기관</h3>
              <input type="text" value={org} placeholder='소속기관' onChange={(e) => setOrg(e.target.value)} required />
            </div>
            <div className='join-container-btn'>
              <button type="submit" className='btnjoin' onClick={handleSubmitManager}>이메일 찾기</button>
            </div>
            {email && (
              <div className='result'>
                <h3>이메일:</h3>
                <p>{email}</p>
              </div>
            )}
            {message && (
              <div className='finderror'>
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Find_email;
