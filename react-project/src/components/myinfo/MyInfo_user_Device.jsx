import React, { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Device = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        { id: 1, deviceid: "lq2w3e4r", devicename: "SMOQ", signupDate: "24/05/06" },
        // Add more users as needed
    ];

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className='myinfo-container'>
            <Header />
            <div className='myinfo-header'>
                <h2>등록 기기 관리</h2>
            </div>
            <div className="device-content">
                <div className="search-section">
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="장치 입력"
                    />
                    <button>등록</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>장치번호</th>
                            <th>장치명</th>
                            <th>등록일자</th>
                            <th>등록해제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.deviceid}</td>
                                <td>{user.devicename}</td>
                                <td>{user.signupDate}</td>
                                <td><button>해제</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
}

export default Device;