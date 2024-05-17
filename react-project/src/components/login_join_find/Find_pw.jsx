import React from 'react'

const Find_pw = () => {
  return (
    // if문 사용해서 
    <div>
        {/* 사용자 */}
        <h2>사용자 비밀번호 변경</h2>
        <form action="">
            <h3>이메일</h3>
            <input type="email" />
            <h3>이름</h3>
            <input type="text" />
            <h3>생년월일</h3>
            <input type="date" />
            <button>비밀번호 변경</button>
        </form>

        {/* 관리자  */}
    <div>
        <h2>관리자 이메일 찾기</h2>
        <form action="">
        <h3>이메일</h3>
            <input type="email" />
            <h3>이름</h3>
            <input type="text" />
            <h3>소속기관</h3>
            <input type="text" />
            <button>비밀번호 변경</button>
        </form>
    </div>
    </div>
  )
}

export default Find_pw