import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa6";

const Find_select = () => {
  const location = useLocation();
  const view = location.state?.view || '';
  const navigate = useNavigate();

  const handleUserFindEmail = () => {
    navigate(`/find_email/user`);
  };

  const handleManagerFindEmail = () => {
    navigate(`/find_email/manager`);
  };

  const handleUserFindPw = () => {
    navigate(`/find_pw/user`);
  };

  const handleManagerFindPw = () => {
    navigate(`/find_pw/manager`);
  };

  return (
    <div className='first-container'>
      {view === 'email' && (
        <div className='first-container'>
          <div className='div-first-title'>
            <h2 className='first-title'>이메일 찾기</h2>
          </div>
          <div className='first-options'>
            <div className='first-option-select' onClick={handleUserFindEmail}>
              <div className='first-option'>
                <BsFillPersonFill className='icon' />
              </div>
              <span>사용자 이메일</span>
            </div>
            <div className='first-option-select' onClick={handleManagerFindEmail}>
              <div className='first-option'>
                <FaKey className='icon' />
              </div>
              <span>관리자 이메일</span>
            </div>
          </div>
        </div>
      )}
      {view === 'password' && (
        <div className='first-container'>
          <div className='div-first-title'>
            <h2 className='first-title'>비밀번호 재설정</h2>
          </div>
          <div className='first-options'>
            <div className='first-option-select' onClick={handleUserFindPw}>
              <div className='first-option'>
                <BsFillPersonFill className='icon' />
              </div>
              <span>사용자 비밀번호</span>
            </div>
            <div className='first-option-select' onClick={handleManagerFindPw}>
              <div className='first-option'>
                <FaKey className='icon' />
              </div>
              <span>관리자 비밀번호</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Find_select;
