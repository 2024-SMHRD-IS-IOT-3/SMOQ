import React, { useEffect, useState } from 'react';
import Menu from '../footer/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../axios';
import Header from '../header/Header';
import Cal_table from './Cal_table';

const Detail = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState([]);
    const [parseData, setParseData] = useState([]);
    const [joinedAt, setJoinedAt] = useState(null);

    useEffect(() => {
        const joinedAtString = sessionStorage.getItem('joined_at');
        if (joinedAtString) {
            const joinedAtDate = new Date(joinedAtString);
            setJoinedAt(joinedAtDate);
            setStartDate(joinedAtDate);
            setEndDate(new Date(joinedAtDate.getTime() + 7 * 24 * 60 * 60 * 1000)); // 가입일로부터 일주일 후를 기본값으로 설정
        }
    }, []);

  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

    const handleStartDateChange = (date) => {
        if (joinedAt && date < joinedAt) {
            alert('가입 날짜보다 빠른 날짜는 선택할 수 없습니다.');
            return;
        }

        const oneMonthAfterStart = new Date(date);
        oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

        if (endDate && endDate > oneMonthAfterStart) {
            alert('기간은 최대 한 달까지 설정할 수 있습니다. 종료 날짜를 조정해주세요.');
        } else {
            setStartDate(date);
        }
    };

  const handleEndDateChange = (date) => {
    const oneMonthBeforeEnd = new Date(date);
    oneMonthBeforeEnd.setMonth(oneMonthBeforeEnd.getMonth() - 1);

        if (joinedAt && date < joinedAt) {
            alert('가입 날짜보다 빠른 날짜는 선택할 수 없습니다.');
            return;
        }

        if (startDate && startDate < oneMonthBeforeEnd) {
            alert('기간은 최대 한 달까지 설정할 수 있습니다. 시작 날짜를 조정해주세요.');
        } else {
            setEndDate(date);
        }
    };

    const handleSearch = async () => {
        try {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            const email = sessionStorage.getItem('email'); // 세션 스토리지에서 이메일 가져오기

            console.log('handleSearch Function', formattedStartDate, formattedEndDate, 'email', email); // 요청 전에 확인

            const response = await axios.post('/queryDateRange', {
                email: email,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });

            console.log(response.data.result);
            if (response.data.result.length > 0 && response.data.result !== 'No results found') {
                let parsedData = response.data.result.map(item => {
                    let loca = item[1].split(',');
                    let lat = loca[0];
                    let len = loca[1];
                    return [item[0], lat, len];
                });
                console.log(parsedData);
                setParseData(parsedData);
            } else {
                setParseData([]);
            }
            setData(response.data.result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setParseData([]);
        }
    };

    return (
        <div className='main-container'>
            <Header />
            <div className='cal-container'>
                <div className='datepicker-container-detail' id='caldetail'>
                    <label htmlFor="start-date">시작 날짜 :</label>
                    <DatePicker
                        id="start-date"
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={joinedAt} // 가입 날짜부터 선택 가능하도록 설정
                    />부터
                </div>

                <div className='caldetail-text'>~</div>

                <div className="datepicker-container-detail">
                    <label htmlFor="end-date">종료 날짜:</label>
                    <DatePicker
                        id="end-date"
                        selected={endDate}
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate} // 시작 날짜부터 선택 가능하도록 설정
                    />까지
                </div>

                <button onClick={handleSearch} className='checkbtn-detail'>조회하기</button>

                <hr />
                <div>
                    <h2 className='calbtn-title'>조회 결과</h2>
                    <Cal_table data={parseData} />
                </div>
            </div>

            <div className='footer'>
                <Menu />
            </div>
    </div>
  );
};

export default Detail;
