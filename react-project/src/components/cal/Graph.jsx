import React from 'react';
import Header from '../header/Header';
import Menu from '../footer/Footer';
import { useNavigate } from 'react-router-dom';

const Graph = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Cal_Detail');
  };

  return (
    <div>
      <Header />
      <button id='btn' onClick={handleButtonClick}>그래프</button>
      <div className='footer'><Menu /></div>
    </div>
  );
};

export default Graph;
