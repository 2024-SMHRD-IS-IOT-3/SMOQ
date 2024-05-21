import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { BsFillPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';

const First = () => {
  const [view, setView] = useState('main');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('personal');

  const handleJoinClick = () => {
    setView('join');
    window.history.pushState({ view: 'join' }, 'join', window.location.pathname);
  };

  const handleLoginClick = () => {
    setView('login');
    window.history.pushState({ view: 'login' }, 'login', window.location.pathname);
  };

  const handleUserJoin = () => {
    navigate('/join_first/user');
  };

  const handleManagerJoin = () => {
    navigate('/join_first/manager');
  };

  const handleFindID = () => {
    navigate('/find_select', { state: { view: 'email' } });
  };
  
  const handleFindPW = () => {
    navigate('/find_select', { state: { view: 'password' } });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleLogin = () => {
    axios.post('/login', { email, password, userType })
      .then(res => {
        if (res.data.success) {
          sessionStorage.setItem('email', res.data.email);
          sessionStorage.setItem('joined_at', res.data.joined_at)
          if (userType === 'personal') {
            console.log('Navigating to /main'); // 추가된 로그
            navigate('/main');
          } else if (userType === 'manager') {
            console.log('Navigating to /main_mgr'); // 추가된 로그
            navigate('/main_mgr');
          }
           
        } else {
          alert(res.data.message);
        }
      })
      .catch(error => {
        console.error('로그인 실패:', error);
        alert('로그인 실패');
      });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView('main');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className='first-container'>
      {view === 'main' && (
        <>
          <div className='first-title'>
            <h1>SMOQ</h1>
          </div>
          <Button variant="secondary" className='btn-join' onClick={handleJoinClick}>회원가입</Button>{' '}
          <Button variant="secondary" className='btn-login' onClick={handleLoginClick}>로그인</Button>{' '}
        </>
      )}
      {view === 'join' && (
        <div className='first-container'>
          <div className='div-first-title'>
            <h2 className='first-title'>회원가입</h2>
          </div>
          <div className='first-options'>
            <div className='first-option-select' onClick={handleUserJoin}>
              <div className='first-option'>
                <BsFillPersonFill className='icon' />
              </div>
              <span>사용자 회원가입</span>
            </div>
            <div className='first-option-select' onClick={handleManagerJoin}>
              <div className='first-option'>
                <FaKey className='icon' />
              </div>
              <span>관리자 회원가입</span>
            </div>
          </div>
        </div>
      )}
      {view === 'login' && (
        <div className='first-container'>
          <div className='div-first-title'>
            <h2 className='first-title'>로그인</h2>
          </div>
          <div className='radio'>
            <div className='radio-login'>
              <input type="radio" name='login' value='personal' checked={userType === 'personal'} onChange={handleUserTypeChange} />
              <p>개인 사용자</p>
            </div>
            <div className='radio-login'>
              <input type="radio" name='login' value='manager' checked={userType === 'manager'} onChange={handleUserTypeChange}/>
              <p>관리자</p>
            </div>
          </div>
          <div className='firstlogininput'>
            <div className='loginicon'>
              <BsFillPersonFill className='login' />
            </div>
            <input type="email" className='inputlogin' placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className='firstlogininput'>
          <div className='loginicon'>
            <FaKey className='login' />
          </div>
            <input type="password" className='inputlogin' placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type='submit' className='firstbtn-login' onClick={handleLogin}>로그인</button>
          <div className='loginbtn'>
            <div className='login-findbtn'>
              <button className='login-find' onClick={handleFindID}>이메일 찾기</button>
              <button className='login-find' onClick={handleFindPW}>패스워드 찾기</button>
            </div>
            <div className='loginline'></div>
            <div className='login-joinbtn-box'>
              <button className='login-joinbtn' onClick={handleJoinClick}>회원가입</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default First;
