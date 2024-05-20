import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Menu from '../footer/Footer';
import { Routes, Route, Link } from 'react-router-dom';
import Cal_Detail from './Cal_Detail';
import Cal_main from './Cal_main';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const data = [
  { "time_hour": 5, "time_amount": 27710, "time_count": 5 },
  { "time_hour": 6, "time_amount": 27682, "time_count": 2 },
  { "time_hour": 7, "time_amount": 22764, "time_count": 4 },
  { "time_hour": 8, "time_amount": 46618, "time_count": 2 },
  { "time_hour": 9, "time_amount": 49682, "time_count": 2 },
  { "time_hour": 10, "time_amount": 30535, "time_count": 2 }
];

const Graph = () => {
  const [startDate, setStartDate] = useState(new Date("2024/05/17"));
  const [endDate, setEndDate] = useState(new Date("2024/05/19"));
  const [graphData, setGraphData] = useState(null);
  const [joinedAt, setJoinedAt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedAt = async () => {
      try {
        const response = await axios.post('/get-joined-at');
        const joinedAt = response.data.joinedAt;
        sessionStorage.setItem('joinedAt', joinedAt);
        setJoinedAt(new Date(joinedAt));
      } catch (error) {
        console.error('Failed to fetch joined_at:', error);
      }
    };

    fetchJoinedAt();
  }, []);

  const handleStartDateChange = (date) => {
    const oneMonthAfterStart = new Date(date);
    oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

    if (joinedAt && date < joinedAt) {
      alert('시작 날짜는 가입 날짜 이후로 선택해야 합니다. 다시 선택해주세요.');
      return;
    }

    if (endDate > oneMonthAfterStart) {
      alert('기간은 최대 한 달까지 설정할 수 있습니다. 종료 날짜를 조정해주세요.');
    } else {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    const oneMonthBeforeEnd = new Date(date);
    oneMonthBeforeEnd.setMonth(oneMonthBeforeEnd.getMonth() - 1);

    if (startDate < oneMonthBeforeEnd) {
      alert('기간은 최대 한 달까지 설정할 수 있습니다. 시작 날짜를 조정해주세요.');
    } else {
      setEndDate(date);
    }
  };

  const maxAmount = Math.max(...data.map((item) => item.time_amount));
  const maxYValue = Math.round((maxAmount * 1.3) / 1000) * 1000;

  const chartData = {
    labels: data.map((item) => `${item.time_hour}시`),
    datasets: [
      {
        yAxisID: "y1",
        type: "bar",
        label: "Bar 차트",
        data: data.map((item) => item.time_amount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        yAxisID: "y1",
        type: "line",
        label: "Line 차트",
        data: data.map((item) => item.time_amount),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y1: {
        beginAtZero: true,
        position: "left",
        max: maxYValue,
      },
    },
    plugins: {
      legend: {
            display: true,
      },
      datalabels: {
        formatter: (value, context) => {
          const timeCount = data[context.dataIndex].time_count;
          return timeCount;
        },
        display: function (context) {
          return context.dataset.yAxisID !== "y2";
        },
        color: "black",
        anchor: "end",
        align: "start",
      },
    },
  };

  const handleCalendarClick = () => {
    navigate('/Cal_main');
  };

  return (
    <div className="container">
      <Header />
      <div className="controls">
        <button id='btn' onClick={handleCalendarClick}>캘린더</button>
        <div className="datepicker-container">
          <label htmlFor="start-date">시작 날짜:</label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="datepicker-container">
          <label htmlFor="end-date">종료 날짜:</label>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <button> 조회하기 </button>
      </div>
      <div>
        <Link to='/Cal_Detail' id='lk'>자세히보기{'>'}</Link>
      </div>
      <Routes>
        <Route path='/Cal_Detail' element={<Cal_Detail />} />
        <Route path='/Cal_Main' element={<Cal_main />} />
      </Routes>
      <div className="graph">
        <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
      <div className='footer'><Menu /></div>
    </div>
  );
};

export default Graph;