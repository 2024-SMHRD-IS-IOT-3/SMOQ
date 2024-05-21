import React from "react";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate() 

  const handleMain = () => {
    navigate('/main');
  }
  return (
    <div>
      <div className="div-header">
        <div className="header">
          <div className="header-section" onClick={handleMain}>
            <button id="title">SMOQ</button>
          </div>
          <div className="header-section">
            <div className="notibell">
              <NotificationBell count={5} />
            </div>
          </div>
        </div>
      </div>
      <hr className="hr" />
    </div>
  );
};

export default Header;
