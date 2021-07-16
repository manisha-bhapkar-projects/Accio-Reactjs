import React from 'react';
import LoginLayout from '../../components/LoginLayout/LoginLayout';

function RecoveryLinkInfo() {
  return (
    <LoginLayout>
      <div className="recovery-link">
        <div className="info-text">
          <div>
            A password recovery link has been sent to your email ID
            s**********@mail.com
          </div>
          <br />
          <div>Please click on the link to change your password</div>
        </div>
        <button type="submit" className="btn btn-block btn-primary">
          Refresh
        </button>
      </div>
    </LoginLayout>
  );
}

export default RecoveryLinkInfo;
