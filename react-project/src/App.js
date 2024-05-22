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
import Journal from './components/journal/Journal';
import Journalmgr from './components/journal/Journal_mgr';
import Journalcomment from './components/journal/Journal_comment';
import Journalcommentmgr from './components/journal/Journal_comment_mgr';
import Kakao from './components/kakao/Kakao';
import Write from './components/journal/Write';
import Writemgr from './components/journal/Write_mgr';
import MyInfo_user from './components/myinfo/MyInfo_user';
import MyInfo_user_ProfileEdit from './components/myinfo/MyInfo_user_ProfileEdit';
import MyInfo_user_PWEdit from './components/myinfo/MyInfo_user_PWEdit';
import MyInfo_user_Device from './components/myinfo/MyInfo_user_Device';
import MyInfo_user_Feedback from './components/myinfo/MyInfo_user_Feedback';
import MyInfo_user_Resign from './components/myinfo/MyInfo_user_Resign'
import MyInfo_mgr from './components/myinfo/MyInfo_mgr';
import MyInfo_mgr_ProfileEdit from './components/myinfo/MyInfo_mgr_ProfileEdit';
import MyInfo_mgr_PWEdit from './components/myinfo/MyInfo_mgr_PWEdit';
import MyInfo_mgr_User from './components/myinfo/MyInfo_mgr_user'; /**주영빈 */
import MyInfo_mgr_Feedback from './components/myinfo/MyInfo_mgr_Feedback';
import MyInfo_mgr_Resign from './components/myinfo/MyInfo_mgr_Resign';

function App() {
  return (
    <div className='App'>
      <h1>
        <Link to='/'></Link>
      </h1>
      <Routes>
        {/* 처음 ~ 로그인, 회원가입, 이메일/비밀번호 찾기 */}
        <Route path='/' element={<First />} />
        <Route path='/join_first/:userType' element={<Joinfirst />} />
        <Route path='/join/:userTypeJoin' element={<Join />} />
        <Route path='/find_select' element={<Findselect />} />
        <Route path='/find_email/:userType' element={<Findemail />} />
        <Route path='/find_pw/:userType' element={<Findpw />} />

        {/* 사용자 메인 */}
        <Route path='/main' element={<Main />} />

        {/* 기록 */}
        <Route path='/Cal_main' element={<Calmain />} />
        <Route path='/Cal_Detail' element={<CalDetail />} />
        <Route path='/Graph' element={<Graph />} />
        
        {/* 장소 */}
        <Route path='/kakao' element={<Kakao />} />


        {/* 관리자 메인 */}
        <Route path='/main_mgr' element={<MainMgr />} />
        <Route path='/select_user_data' element={<SelectUserData/>}/>

        {/* 저널 */}
        <Route path='/journal' element={<Journal />} />
        <Route path='/journal_mgr' element={<Journalmgr />} />
        <Route path='/journal_comment/:id' element={<Journalcomment />} />
        <Route path='/journal_comment_mgr/:id' element={<Journalcommentmgr />} />
        <Route path='/write_mgr' element={<Writemgr />} />
        <Route path='/write' element={<Write />} />
        <Route path='/journal_comment' element={<Journalcomment />} />

        {/* 내정보-유저 */}
        <Route path='/MyInfo_user' element={<MyInfo_user/>} />
        <Route path='/MyInfo_user_ProfileEdit' element={<MyInfo_user_ProfileEdit/>} />
        <Route path='/MyInfo_user_PWEdit' element={<MyInfo_user_PWEdit/>} />
        <Route path='/MyInfo_user_Device' element={<MyInfo_user_Device/>} />
        <Route path='/MyInfo_user_Feedback' element={<MyInfo_user_Feedback/>} />
        <Route path='/MyInfo_user_Resign' element={<MyInfo_user_Resign/>} />

        {/* 내정보-관리자 */}
        <Route path='/MyInfo_mgr' element={<MyInfo_mgr/>} />
        <Route path='/MyInfo_mgr_ProfileEdit' element={<MyInfo_mgr_ProfileEdit/>} />
        <Route path='/MyInfo_mgr_PWEdit' element={<MyInfo_mgr_PWEdit/>} />
        <Route path='/MyInfo_mgr_User' element={<MyInfo_mgr_User/>} />
        <Route path='/MyInfo_mgr_Feedback' element={<MyInfo_mgr_Feedback/>} />
        <Route path='/MyInfo_mgr_Resign' element={<MyInfo_mgr_Resign/>} />
      </Routes>
    </div>
  );
}

export default App;
