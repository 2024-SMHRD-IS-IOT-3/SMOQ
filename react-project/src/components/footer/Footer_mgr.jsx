import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
<<<<<<< HEAD
import { CgNotes } from "react-icons/cg";
import { FaLocationDot } from "react-icons/fa6";
=======
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
import { HiMiniHome } from "react-icons/hi2";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { BsFillPersonFill } from "react-icons/bs";

function Footermgr() {
  const location = useLocation();
  
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container className='nav-container'>
        <Nav className="me-auto">
<<<<<<< HEAD
          <Nav.Link href="#" className={getNavLinkClass('#')}>
=======
          <Nav.Link href="/journal" className={getNavLinkClass('/journal')}>
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
            <div className="nav-item">
              <TbMessageCircle2Filled className="nav-icon" />
              <span>저널</span>
            </div>
          </Nav.Link>
<<<<<<< HEAD
          <Nav.Link href="/main_mgr" className={getNavLinkClass('main_mgr')}>
=======
          <Nav.Link href="/main_mgr" className={getNavLinkClass('/main_mgr')}>
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
            <div className="nav-item">
              <HiMiniHome className="nav-icon" />
              <span>메인</span>
            </div>
          </Nav.Link>
          
<<<<<<< HEAD
          <Nav.Link href="#" className={getNavLinkClass('#')}>
=======
          <Nav.Link href="#" className={getNavLinkClass('/profile')}>
>>>>>>> 638558d203d5d9070cafa9838232e3b82051d888
            <div className="nav-item">
              <BsFillPersonFill className="nav-icon" />
              <span>내정보</span>
            </div>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footermgr;
