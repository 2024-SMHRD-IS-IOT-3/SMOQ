import React, { useEffect, useState } from 'react';
import './Cal_table.css'; // CSS 파일을 import
import axios from '../../axios';

const Cal_table = ({ data }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses = await Promise.all(
        data.map(async (item) => {
          const [time, lat, lng] = item;
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=AIzaSyCEb6QXwp69UevtYiAhag2QKqtpaxwEwaM`;
          try {
            const response = await axios.get(url);
            const results = response.data.results;
            if (results.length > 0) {
              const addressComponents = results[0].address_components;
              const formattedAddress = formatAddress(addressComponents);
              return formattedAddress;
            }
            return '주소를 찾을 수 없음';
          } catch (error) {
            console.error(error);
            return '주소를 가져오는 중 오류 발생';
          }
        })
      );
      setAddresses(newAddresses);
    };

    fetchAddresses();
  }, [data]);

  const formatAddress = (components) => {
    const locality = components.find(component => component.types.includes('locality'))?.long_name || '';
    const sublocality1 = components.find(component => component.types.includes('sublocality_level_1'))?.long_name || '';
    const sublocality2 = components.find(component => component.types.includes('sublocality_level_2'))?.long_name || '';
    return `${locality} ${sublocality1} ${sublocality2}`;
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>시간</th>
          <th>장소</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item[0]}</td>
            <td>{addresses[index] || '로딩 중...'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Cal_table;
