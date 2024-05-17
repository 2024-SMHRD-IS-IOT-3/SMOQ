import React from 'react'

const Join_manage = () => {
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
        <h3>소속 기관</h3>
        <input type="text" />
        <input type="submit">회원가입</input>
    </div>
  )
}

export default Join_manage