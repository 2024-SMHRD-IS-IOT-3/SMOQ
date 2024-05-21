import React, { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Feedback = () => {
    const [feedback, setFeedback] = useState({
        category: '',
        message: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFeedback({
            ...feedback,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitted feedback:', feedback);
        // Here you can integrate API to send feedback
    };

    return (
        <div className='myinfo-container'>
            <Header />
            <div className='myinfo-header'>
                <h2>문의하기</h2>
            </div>
            <div className='myinfo-body'>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='category'>카테고리</label>
                        <select id='category' name='category' value={feedback.category} onChange={handleInputChange}>
                            <option value=''>선택하세요</option>
                            <option value='service'>서비스</option>
                            <option value='product'>제품</option>
                            <option value='support'>지원</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='message'>내용을 입력하세요</label>
                        <textarea id='message' name='message' value={feedback.message} onChange={handleInputChange} />
                    </div>
                    <div className='profile-actions'>
                        <button type='button' onClick={() => {}}>취소</button>
                        <button type='submit'>보내기</button>
                    </div>
                </form>
            </div>
        <div className='footer'>
            <Footer />
        </div>
    </div>
    );
};

export default Feedback;