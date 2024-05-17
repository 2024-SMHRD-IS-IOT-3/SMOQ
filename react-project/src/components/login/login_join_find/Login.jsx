import React from 'react'

const Login = () => {
  return (
    <div>
        <h2>로그인</h2>
        <form action="">
            <input type="radio" name='login' value="user">사용자</input>
            <input type="radio" name='login' value="manager">관리자</input>
            <input type="email" />
            <input type="password" />
            <input type="submit">로그인</input>
        </form>
        <button>아이디 찾기</button>
        <button>패스워드 찾기</button>
    </div>
  )
}

export default Login