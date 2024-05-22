import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Menu from "../footer/Footer";
import { Routes, Route, Link } from "react-router-dom";
import Cal_Detail from "./Cal_Detail";
import Cal_main from "./Cal_main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "../../axios";

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

const Graph = () => {
  const [startDate, setStartDate] = useState(new Date("2024/05/17"));
  const [endDate, setEndDate] = useState(new Date("2024/05/19"));
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchJoinedAt = async () => {
  //     try {
  //       const response = await axios.post('/get-joined-at');
  //       const joinedAt = response.data.joinedAt;
  //       sessionStorage.setItem('joinedAt', joinedAt);
  //       setJoinedAt(new Date(joinedAt));
  //     } catch (error) {
  //       console.error('Failed to fetch joined_at:', error);
  //     }
  //   };

  //   fetchJoinedAt();
  // }, []);

  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleStartDateChange = (date) => {
    const oneMonthAfterStart = new Date(date);
    oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

    if (endDate > oneMonthAfterStart) {
      alert(
        "기간은 최대 한 달까지 설정할 수 있습니다. 종료 날짜를 조정해주세요."
      );
    } else {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    const oneMonthBeforeEnd = new Date(date);
    oneMonthBeforeEnd.setMonth(oneMonthBeforeEnd.getMonth() - 1);

    if (startDate < oneMonthBeforeEnd) {
      alert(
        "기간은 최대 한 달까지 설정할 수 있습니다. 시작 날짜를 조정해주세요."
      );
    } else {
      setEndDate(date);
    }
  };

  const handleSearch = async () => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const email = sessionStorage.getItem("email");

      console.log(
        "handleSearch Function",
        formattedStartDate,
        formattedEndDate
      ); // 요청 전에 확인

      const response = await axios.post("/graphDateRange", {
        email: email,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartData = {
    labels: data.map((item) => item[0]), // 날짜 레이블
    datasets: [
      {
        yAxisID: "y1",
        type: "bar",
        label: "담배 피운 횟수",
        data: data.map((item) => item[1]), // 담배 피운 횟수 데이터
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y1: {
        beginAtZero: true,
        position: "left",
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        formatter: (value) => value,
        color: "black",
        anchor: "end",
        align: "start",
      },
    },
  };

  const handleCalendarClick = () => {
    navigate("/Cal_main");
  };

  return (
    <div className="main-container">
      <Header />
      <div className="controls">
        <div className="cal-text">
          <button id="calbtn" onClick={handleCalendarClick}>
            캘린더
          </button>
          <Link to="/Cal_Detail" id="lk">
            자세히보기{">"}
          </Link>
        </div>
        <div className="date-picker">
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
        </div>
        <button onClick={handleSearch} className="checkbtn">
          조회하기
        </button>
      </div>

      <Routes>
        <Route path="/Cal_Detail" element={<Cal_Detail />} />
        <Route path="/Cal_Main" element={<Cal_main />} />
      </Routes>
      <div className="graph-container">
        <div className="graph">
          <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
      <div className="footer">
        <Menu />
      </div>
    </div>
  );
};

export default Graph;
