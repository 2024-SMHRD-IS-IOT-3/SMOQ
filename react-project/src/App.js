import './App.css';
// Bootstrap 사용할 시 import 필수!
// import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';

import {Routes, Route, Link} from 'react-router-dom';
import First from './components/login/login_join_find/First';
import Main from './components/main/Main';
import Cal_main from './components/cal/Cal_main';
import Graph from './components/cal/Graph'
import Cal_Detail from './components/cal/Cal_Detail';


// 회원가입, 로그인, 회원탈퇴, 로그아웃, 회원전체검색, 회원 검색, 회원정보수정 

// 1 GROUP - 로그인을 안한경우 :  회원가입, 로그인 
// 2 GROUP - 일반 유저인 경우 :  회원탈퇴, 정보수정, 로그아웃
// 3 GROUP - 관리자인경우 : 회원검색, 회원전체검색 + 2GROUP 


function App() {
  return (
    <div className='App'>
      <h1>
        <Link to='/'></Link>
      </h1>
      <Routes>
        <Route path='/' element={<First/>}></Route>
        <Route path='/main' element={<Main/>}></Route>
        <Route path='/Cal_main' element={<Cal_main/>}></Route>
        <Route path='/Cal_Detail' element={<Cal_Detail/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
