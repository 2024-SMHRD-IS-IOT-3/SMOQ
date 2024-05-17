import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { BsFillPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa6";


const First = () => {
  const [view, setView] = useState('main');

  const handleJoinClick = () => {
    setView('join');
    window.history.pushState({ view: 'join' }, 'join', window.location.pathname);
  };

  const handleLoginClick = () => {
    setView('login');
    window.history.pushState({ view: 'login' }, 'login', window.location.pathname);
  };

  const handleUserJoin = () => {
    setView('selectedjoin')
    window.history.pushState({ view: 'selectedjoin' }, 'selectedjoin', window.location.pathname)
  }

  const handleUserLogin = () => {
    setView('selectedlogin')
    window.history.pushState({ view: 'selectedlogin' }, 'selectedlogin', window.location.pathname)
  }
  

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
            <div className='first-option-select' onClick={handleUserJoin}>
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
          <div className='first-options'>
            <div className='first-option-select' onClick={handleUserLogin}>
              <div className='first-option'>
                <BsFillPersonFill className='icon' />
              </div>
              <span>사용자 로그인</span>
            </div>
            <div className='first-option-select' onClick={handleUserLogin}>
              <div className='first-option'>
                <FaKey className='icon' />
              </div>
              <span>관리자 로그인</span>
            </div>
          </div>
        </div>
      )}
      {view === 'selectedjoin' && (
        <div className='first-container'>
          <div className='div-first-title'>
            <h2 className='first-title'>회원가입</h2>
          </div>
          <h3 className='joinemail'>이메일을 입력해주세요</h3>
          <input type="email" id='eamail' placeholder='email' autofocus/>
          <p className='join-email'>입력하신 이메일은 아이디로 사용됩니다.</p>
          <button className='sendbtn'>이메일로 링크 발송</button>
        </div>
      )}

      {view === 'selectedlogin' && (
        <div>
          <h2>로그인</h2>
          <form action="">
              사용자<input type="radio" name='login' value="user"/>
              관리자<input type="radio" name='login' value="manager"/>
              <input type="email" />
              <input type="password" />
              <button type="submit">로그인</button>
          </form>
          <button>아이디 찾기</button>
          <button>패스워드 찾기</button>
        </div>
      )}

    </div>
  );
};

export default First;
