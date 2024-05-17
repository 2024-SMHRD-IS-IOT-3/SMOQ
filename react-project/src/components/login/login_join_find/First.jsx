import React from 'react'
import Button from 'react-bootstrap/Button';

const First = () => {
  return (
    <div className='first-container'>
        <h1>SMOQ</h1>
        <Button variant="secondary" className='btn-join'>회원가입</Button>{' '}
        <Button variant="secondary" className='btn-login'>로그인</Button>{' '}
    </div>
  )
}

export default First