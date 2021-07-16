import React from 'react';
import PropTypes from 'prop-types';
import './LoginLayout.scss';
import accioLogo from '../../images/logo/main.png';

function LoginLayout({ children }) {
  return (
    <div className="login-layout">
      <div className="loginBackground">
        <div className="login-container">
          <img src={accioLogo} alt="accio" />
          <div className="children-content">{children}</div>
        </div>
      </div>
      <div className="yellow-line" />
    </div>
  );
}

LoginLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
};

export default LoginLayout;
