import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Footermgr from '../footer/Footer_mgr';
import axios from '../../axios';

const Select_user_data = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedUser = location.state?.selectedUser || null;
  const [smokingData, setSmokingData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!selectedUser) {
      setMessage('사용자 정보가 없습니다.');
      return;
    }

    const fetchSmokingData = async () => {
      try {
        const response = await axios.post('/get-smoking-data', { name: selectedUser.USER_NAME, birthDate: selectedUser.USER_BIRTHDATE });
        if (response.data.success) {
          setSmokingData(response.data.data);
          setMessage('');
        } else {
          setSmokingData([]);
          setMessage('흡연 데이터를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('흡연 데이터 불러오기 실패:', error);
        setMessage('흡연 데이터 불러오기 실패');
      }
    };

    fetchSmokingData();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className='main-container'>
        <Header/>
        <div className='alert'>사용자 정보가 없습니다.</div>
        <div className='footer'><Footermgr/></div>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <Header/>
      <div className='mgr-container'>
        <div className='text-mgrselect'>
            <h3>{selectedUser.USER_NAME}</h3>
            <p>님의 흡연기록</p>
        </div>
      <table className='user-table'>
        <thead>
          <tr>
            <th>흡연 날짜</th>
            <th>흡연 위치</th>
          </tr>
        </thead>
        <tbody>
          {smokingData.length > 0 ? (
            smokingData.map((record, index) => (
              <tr key={index}>
                <td>{record.SMOKE_DATE}</td>
                <td>{record.SMOKE_LOC}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
 
      </div>
      <div className='footer'>
        <Footermgr/>
      </div>
    </div>
  );
};

export default Select_user_data;
