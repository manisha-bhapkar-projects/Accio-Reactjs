import React from 'react';
import { Link } from 'react-router-dom';
import LoginLayout from '../../components/LoginLayout/LoginLayout';
import TextFieldComponent from '../../components/TextFieldComponent/TextFieldComponent';
import './ForgotPassword.scss';

function ForgotPassword() {
  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <LoginLayout>
      <div className="forgot-password">
        <div className="info-text">
          <div>
            Enter your username or email ID and we’ll send you a link to get
            back into your account.
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextFieldComponent
            id="username"
            type="email"
            name="username"
            label="Username/ Email ID"
            labelClassName="username-label"
            inputClassName="input-text"
          />
          <button type="submit" className="btn btn-block btn-primary">
            Reset Password
          </button>
          <Link to="/">
            <button type="button" className="btn btn-block btn-secondary">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </LoginLayout>
  );
}

export default ForgotPassword;
