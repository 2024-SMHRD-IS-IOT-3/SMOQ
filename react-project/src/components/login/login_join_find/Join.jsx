import React from 'react'

const Join = () => {
  return (
    <div>
      <h2>회원가입</h2>
      <h3>이메일을 입력해주세요</h3>
      <input type="email" />
      <p>입력하신 이메일은 아이디로 사용됩니다.</p>
      <button>이메일로 링크 발송</button>
    </div>
  )
}

export default Join