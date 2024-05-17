import React from 'react'

const Join_user = () => {
  return (
    <div>
        <h2>회원가입</h2>
        <h3>이메일</h3>
        <input type="email" />
        <h3>비밀번호</h3>
        <input type="password" />
        <h3>비밀번호 확인</h3>
        <input type="password" />
        <h3>이름</h3>
        <input type="text" />
        <h3>닉네임</h3>
        <input type="text" />
        <h3>생년월일</h3>
        <input type="date" />
        <input type="submit">회원가입</input>
    </div>
  )
}

export default Join_user