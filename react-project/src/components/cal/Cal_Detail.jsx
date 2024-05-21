import React, { useState } from "react";
import Menu from "../footer/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../axios";
import Header from "../header/Header";

const Detail = () => {
  const [startDate, setStartDate] = useState(new Date("2024/05/17"));
  const [endDate, setEndDate] = useState(new Date("2024/05/19"));
  const [data, setData] = useState([]);

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

      const response = await axios.post("/queryDateRange", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        email: email,
      });

      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="cal-container">
        <div className="datepicker-container-detail" id="caldetail">
          <label htmlFor="start-date">시작 날짜 :</label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          부터
        </div>

        <div className="caldetail-text">~</div>

        <div className="datepicker-container-detail">
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
          까지
        </div>

        <button onClick={handleSearch} className="checkbtn-detail">
          조회하기
        </button>

        <hr />
        <div className="caldetail">
          <h2 className="calbtn-title">조회 결과</h2>
          <table>
            <thead>
              <tr>
                <th>일시</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="footer">
        <Menu />
      </div>
    </div>
  );
};

export default Detail;
