import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import JournalItem from './JournalItem';
import './journal.css';
import { IoSearch } from "react-icons/io5";
import axios from '../../axios';

const Journal = () => {
  const [journalData, setJournalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const response = await axios.get('/journallist');
        if (response.data.success) {
          setJournalData(response.data.data);
        } else {
          console.error('실패');
        }
      } catch (error) {
        console.error('에러:', error);
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

  return (
    <div className='main-container'>
      <Header />
      <div className='journal-container'>
        <div className='div-search'>
          <div className='searchinput-div'>
            <div className='searchicon'>
              <IoSearch className='login' />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button className='btnwrite'>글쓰기</button>
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
          />
        ))}
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
  );
}

export default Journal;
