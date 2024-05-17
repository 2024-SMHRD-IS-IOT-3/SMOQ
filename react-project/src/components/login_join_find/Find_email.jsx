import React from 'react'

const Find_email = () => {
  return (
    // if문 사용해서 
    <div>
        {/* 사용자 */}
        <h2>사용자 이메일 찾기</h2>
        <form action="">
            <h3>이름</h3>
            <input type="text" />
            <h3>생년월일</h3>
            <input type="date" />
            <button>이메일 찾기</button>
        </form>

        {/* 관리자  */}
    <div>
        <h2>관리자 이메일 찾기</h2>
        <form action="">
            <h3>이름</h3>
            <input type="text" />
            <h3>소속 기관</h3>
            <input type="text" />
            <button>이메일 찾기</button>
        </form>
    </div>
    </div>
  )
}

export default Find_email