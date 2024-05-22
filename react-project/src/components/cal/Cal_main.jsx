import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Header from "../header/Header";
import Menu from "../footer/Footer";
import Cal_real from "./Cal_real";
import Cal_table from "./Cal_table";
import "react-calendar/dist/Calendar.css";
import axios from "../../axios";

const Cal_main = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [parseData, setParseData] = useState([]);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    const email = sessionStorage.getItem('email'); // 세션 스토리지에서 이메일 가져오기
    const joinedAt = sessionStorage.getItem('joined_at'); // 세션 스토리지에서 joined_at 가져오기
    const formattedDate = formatDate(new Date(date));
    const formattedJoinedAt = formatJoinedAtDate(joinedAt);

    console.log('Selected date:', formattedDate);
    console.log('Joined at date:', formattedJoinedAt);

    if (isDateBefore(formattedDate, formattedJoinedAt)) {
      alert('가입 날짜보다 빠른 날짜는 선택할 수 없습니다.');
      return;
    }

    console.log('handle date Function', formattedDate);

    axios.post('/handledate', {
      date: formattedDate,
      email: email,
    }).then(res => {
      console.log(res.data.result);
      if (res.data.result.length > 0 && res.data.result !== 'No results found') {
        let loca = res.data.result[0][1].split(',');
        let lat = loca[0];
        let len = loca[1];

        let parsedData = [[res.data.result[0][0], lat, len]];
        console.log(parsedData);
        setParseData(parsedData);
      } else {
        setParseData([]);
      }
      setData(res.data.result);
    }).catch(error => {
      console.error("There was an error fetching the data!", error);
      setParseData([]);
    });
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatJoinedAtDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const convertToDateObject = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return new Date(`20${year}-${month}-${day}`);
  };

  const isDateBefore = (date1, date2) => {
    const date1Obj = convertToDateObject(date1);
    const date2Obj = convertToDateObject(date2);
    console.log('Comparing dates:', date1Obj, date2Obj);
    return date1Obj < date2Obj;
  };

  const handleGraphClick = () => {
    navigate("/Graph");
  };

  return (
    <div className="main-container">
      <Header />
      <div className="cal-container">
        <div className="cal-text">
          <button id="calbtn" onClick={handleGraphClick}>
            그래프
          </button>
          <Link to="/Cal_Detail" id="lk">
            자세히보기{">"}
          </Link>
        </div>      
        <div className='cal'>
          <div className='cal-real'>
            <Cal_real selectedDate={selectedDate} onDateChange={handleDateChange} />
          </div>
          <div>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
          </div>
          <hr />
          <Cal_table data={parseData} />

        </div>
      </div>

      <div className="footer">
        <Menu />
      </div>
    </div>
  );
};

export default Cal_main;
