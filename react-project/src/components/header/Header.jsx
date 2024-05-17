import React from "react";
import NotificationBell from "./NotificationBell";

const Header = () => {
  return (
    <div>
      <div className="div-header">
        <div className="header">
          <div className="header-section">
            <h2 id="title">SMOQ</h2>
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
