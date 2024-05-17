import React from 'react';
import './Cal_table.css'; // CSS 파일을 import

const Cal_table = ({ data }) => {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>시간</th>
          <th>장소</th>
          <th>메모</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item[0]}</td><td>{item[1]}</td><td>-</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Cal_table;
