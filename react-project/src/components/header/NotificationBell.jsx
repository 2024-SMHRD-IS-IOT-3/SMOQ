import React from 'react';
import { IoNotificationsOutline } from "react-icons/io5";


const NotificationBell = ({ count }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '40px' }}>
            <IoNotificationsOutline  size="60px"/>
            {count > 0 && (
                <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-13px',
                backgroundColor: 'red',
                width: '25px',
                height: '25px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}>
                {count}
                </span> 
            )}
      </div>
  );
};

export default NotificationBell;
