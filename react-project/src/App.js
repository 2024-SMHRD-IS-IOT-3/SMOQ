<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';

import { Routes, Route, Link } from 'react-router-dom';
import First from './components/login_join_find/First';
import Main from './components/main/Main';
import Calmain from './components/cal/Cal_main';
import Graph from './components/cal/Graph';
import CalDetail from './components/cal/Cal_Detail';
import Joinfirst from './components/login_join_find/Join_first';
import Join from './components/login_join_find/Join';
import Findselect from './components/login_join_find/Find_select';
import Findemail from './components/login_join_find/Find_email';
import Findpw from './components/login_join_find/Find_pw';
import MainMgr from './components/main/Main_mag'
import SelectUserData from './components/main/Select_user_data'
<<<<<<< HEAD
import MyInfo_user from './components/myinfo/MyInfo_user';
import MyInfo_user_ProfileEdit from './components/myinfo/MyInfo_user_ProfileEdit';
import MyInfo_user_PWEdit from './components/myinfo/MyInfo_user_PWEdit';
import MyInfo_user_Device from './components/myinfo/MyInfo_user_Device';
import MyInfo_user_Feedback from './components/myinfo/MyInfo_user_Feedback';
import MyInfo_user_Resign from './components/myinfo/MyInfo_user_Resign';

=======
import Journal from './components/journal/Journal';
import Journalcomment from './components/journal/Journal_comment';
import Kakao from './components/kakao/Kakao';
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888

function App() {
  return (
    <div className='App'>
      <h1>
        <Link to='/'></Link>
      </h1>
      <Routes>
<<<<<<< HEAD
=======
        {/* 처음 ~ 로그인, 회원가입, 이메일/비밀번호 찾기 */}
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
        <Route path='/' element={<First />} />
        <Route path='/join_first/:userType' element={<Joinfirst />} />
        <Route path='/join/:userTypeJoin' element={<Join />} />
        <Route path='/find_select' element={<Findselect />} />
        <Route path='/find_email/:userType' element={<Findemail />} />
        <Route path='/find_pw/:userType' element={<Findpw />} />
<<<<<<< HEAD
        <Route path='/main' element={<Main />} />
=======

        {/* 사용자 메인 */}
        <Route path='/main' element={<Main />} />

        {/* 기록 */}
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
        <Route path='/Cal_main' element={<Calmain />} />
        <Route path='/Cal_Detail' element={<CalDetail />} />
        <Route path='/Graph' element={<Graph />} />
        
<<<<<<< HEAD
        <Route path='/main_mgr' element={<MainMgr />} />
        <Route path='/select_user_data' element={<SelectUserData/>}/>
        <Route path='/MyInfo_user' element={<MyInfo_user/>} />
        <Route path='/MyInfo_user_ProfileEdit' element={<MyInfo_user_ProfileEdit/>} />
        <Route path='/MyInfo_user_PWEdit' element={<MyInfo_user_PWEdit/>} />
        <Route path='/MyInfo_user_Device' element={<MyInfo_user_Device/>} />
        <Route path='/MyInfo_user_Feedback' element={<MyInfo_user_Feedback/>} />
        <Route path='/MyInfo_user_Resign' element={<MyInfo_user_Resign/>} />
=======
        {/* 장소 */}
        <Route path='/kakao' element={<Kakao />} />


        {/* 관리자 메인 */}
        <Route path='/main_mgr' element={<MainMgr />} />
        <Route path='/select_user_data' element={<SelectUserData/>}/>

        {/* 저널 */}
        <Route path='/journal' element={<Journal />} />
        <Route path='/journal_comment' element={<Journalcomment />} />
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
      </Routes>
>>>>>>> 94d61397e3aad02b6d6c6e12a9e81a461bbf6073
    </div>
  );
}

export default App;
