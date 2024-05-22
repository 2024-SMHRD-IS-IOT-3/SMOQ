import React, { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Resign = () => {
    const [form, setForm] = useState({
        email: '',
        reason: '',
        feedback: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Unsubscribe Details:', form);
        // Here you would typically handle the unsubscribe logic
    };

    return (
        <div className='myinfo-container'>
            <Header />
            <div className='myinfo-header'>
            <h2>탈퇴하기</h2>
            </div>
                <form onSubmit={handleSubmit} className='myinfo-body'>
                    <div className='form-group'>
                        <label htmlFor='email'>이메일</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={form.email}
                            onChange={handleInputChange}
                            placeholder='e-mail'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='reason'>탈퇴 이유</label>
                        <select id='reason' name='reason' value={form.reason} onChange={handleInputChange}>
                            <option value=''>선택해주세요</option>
                            <option value='privacy'>개인정보 우려</option>
                            <option value='not_useful'>서비스가 유용하지 않음</option>
                            <option value='other'>기타</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='feedback'>구체적인 내용을 입력해주세요.</label>
                        <textarea
                            id='feedback'
                            name='feedback'
                            value={form.feedback}
                            onChange={handleInputChange}
                            placeholder='내용을 입력하세요'
                        />
                    </div>
                    <div className='profile-actions'>
                        <button type='button' onClick={() => {}}>취소</button>
                        <button type='submit'>탈퇴하기</button>
                    </div>
                </form>
        <div className='footer'>
            <Footer />
        </div>
    </div>
    );
};

export default Resign;