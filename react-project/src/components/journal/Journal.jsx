import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import JournalItem from "./JournalItem";
import { IoSearch } from "react-icons/io5";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./journal.css";

const Journal = () => {
  const [journalData, setJournalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const res = await axios.get("/journallist");
        if (res.data.success) {
          setJournalData(res.data.data);
          console.log(res.data.data);
        } else {
          console.error("실패");
        }
      } catch (error) {
        console.error("에러:", error);
      }
    };

    fetchJournalData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJournalData = journalData.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const writepost = () => {
    navigate("/write");
  };

  return (
    <div className="main-container">
      <Header />
      <div className="journal-container">
        <div className="div-search">
          <div className="searchinput-div">
            <div className="searchicon">
              <IoSearch className="login" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button className="btnwrite" onClick={writepost}>
            글쓰기
          </button>
        </div>
        {filteredJournalData.map((item, index) => (
          <JournalItem
            key={index}
            id={item.id}
            user={item.user}
            date={item.date}
            content={item.content}
            initialLikes={item.likes}
            comments={item.comments}
            writingUser={item.writingUser}
          />
        ))}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Journal;
