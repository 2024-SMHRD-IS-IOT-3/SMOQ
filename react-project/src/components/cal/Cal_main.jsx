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
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    const formattedDate = formatDate(new Date(date));
    console.log("handle date Function", formattedDate);
    const email = sessionStorage.getItem("email");

    axios
      .post("/handledate", {
        date: formattedDate,
        email: email,
      })
      .then((res) => {
        console.log(res.data.result);
        setData(res.data.result);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });

    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
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

        <div className="cal">
          <div className="cal-real">
            <Cal_real
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          </div>
          <div>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
            {selectedDate.getDate()}일
          </div>
          <hr />
          <Cal_table data={data} />
        </div>
      </div>

      <div className="footer">
        <Menu />
      </div>
    </div>
  );
};

export default Cal_main;
