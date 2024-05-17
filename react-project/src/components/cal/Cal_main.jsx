import React, { useState } from 'react';
import Header from '../header/Header';
import Menu from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import Cal_real from './Cal_real';
import Cal_table from './Cal_table';
import 'react-calendar/dist/Calendar.css';
import axios from '../../axios';

const Cal_main = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleDateChange = (date) => {
    const formattedDate = formatDate(new Date(date));
    console.log('handle date Function', formattedDate);
    axios.post('/handledate', {
      date: formattedDate,
    }).then(res => {
      console.log(res.data.result);
      setData(res.data.result); // 받아온 데이터를 상태에 저장
    });

    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleButtonClick = () => {
    navigate('/Cal_Detail'); // 버튼 클릭 시 페이지 이동
  };

  return (
    <div>
      <Header />
      <button id='btn' onClick={handleButtonClick}>그래프</button> {/* onClick 이벤트 추가 */}

      <div>
        <button onClick={() => navigate('/Cal_Detail')} id='lk'>자세히보기{'>'}</button> {/* Link 대신 button 사용 */}
      </div>

      <div>
        <Cal_real selectedDate={selectedDate} onDateChange={handleDateChange}></Cal_real>
        <div>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        </div>
        <hr />
        <Cal_table data={data}></Cal_table> {/* 데이터를 props로 전달 */}
      </div>

      <div className='footer'><Menu /></div>
    </div>
  );
};

export default Cal_main;
