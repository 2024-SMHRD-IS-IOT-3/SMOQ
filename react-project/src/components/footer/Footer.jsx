import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { CgNotes } from "react-icons/cg";
import { FaLocationDot } from "react-icons/fa6";
import { HiMiniHome } from "react-icons/hi2";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { BsFillPersonFill } from "react-icons/bs";

function Footer() {
  const location = useLocation();
  
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container className='nav-container'>
        <Nav className="me-auto">
          <Nav.Link href="/Cal_main" className={getNavLinkClass('/Cal_main')}>
            <div className="nav-item">
              <CgNotes className="nav-icon" />
              <span>기록</span>
            </div>
          </Nav.Link>
          <Nav.Link href="#" className={getNavLinkClass('#')}>
            <div className="nav-item">
              <FaLocationDot className="nav-icon" />
              <span>장소</span>
            </div>
          </Nav.Link>
          <Nav.Link href="/" className={getNavLinkClass('/')}>
            <div className="nav-item">
              <HiMiniHome className="nav-icon" />
              <span>메인</span>
            </div>
          </Nav.Link>
          <Nav.Link href="#" className={getNavLinkClass('#')}>
            <div className="nav-item">
              <TbMessageCircle2Filled className="nav-icon" />
              <span>저널</span>
            </div>
          </Nav.Link>
          <Nav.Link href="#" className={getNavLinkClass('#')}>
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

export default Footer;
