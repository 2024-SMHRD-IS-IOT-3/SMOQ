import React, { useState } from 'react';
import Calendar from 'react-calendar';  // 사용하는 캘린더 라이브러리에 따라 다름

const Cal_real = ({ selectedDate, onDateChange }) => {



  return (
    <div>
      <Calendar
        value={selectedDate}
        onClickDay={(value) => onDateChange(value)}
      />
    </div>
  );
};

export default Cal_real;