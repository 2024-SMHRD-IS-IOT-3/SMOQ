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

function App() {
  return (
    <div className='App'>
      <h1>
        <Link to='/'></Link>
      </h1>
      <Routes>
        <Route path='/' element={<First />} />
        <Route path='/join_first/:userType' element={<Joinfirst />} />
        <Route path='/join/:userTypeJoin' element={<Join />} />
        <Route path='/find_select' element={<Findselect />} />
        <Route path='/find_email/:userType' element={<Findemail />} />
        <Route path='/find_pw/:userType' element={<Findpw />} />
        <Route path='/main' element={<Main />} />
        <Route path='/Cal_main' element={<Calmain />} />
        <Route path='/Cal_Detail' element={<CalDetail />} />
        <Route path='/Graph' element={<Graph />} />
        
        <Route path='/main_mgr' element={<MainMgr />} />
        <Route path='/select_user_data' element={<SelectUserData/>}/>
      </Routes>
    </div>
  );
}

export default App;
