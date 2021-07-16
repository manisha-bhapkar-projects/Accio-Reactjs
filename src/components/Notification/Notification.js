import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import './Notification.scss';
import notificationIcon from '../../images/notification/Group 9.png';

function Notification() {
  const popover = (
    <Popover id="popover-basic" className="notification-popover">
      <Popover.Content>
        <div className="notification-container">
          <div className="message">
            The contractor you requested has been approved
            <p>10 Nov 2019 10:30 AM</p>
          </div>
        </div>
      </Popover.Content>
      <div className="btn-container">
        <button type="button" className="clr-btn">
          Clear
        </button>
      </div>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement="bottom"
      overlay={popover}
    >
      <img src={notificationIcon} alt="" style={{ cursor: 'pointer' }} />
    </OverlayTrigger>
  );
}

export default Notification;
