import React from 'react';
import './ChangePassword.scss';
import {
  SuccessAlert,
  AlertText,
  AlertTitle,
} from '../../components/Alerts/SuccessAlert';
import Layout from '../../components/Layout/Layout';
import TextFieldComponent from '../../components/TextFieldComponent/TextFieldComponent';

function ChangePassword() {
  const AlertTextConent = (
    <>
      <div>Password changed successfully!</div>
      <div>
        Your password has been successfully changes. Please click on the login
        button below to proceed.
      </div>
    </>
  );

  const handleSubmit = () => {
    SuccessAlert.fire({
      title: <AlertTitle titleProp="Success" />,
      html: <AlertText>{AlertTextConent}</AlertText>,
      confirmButtonText: 'Login',
    }).then(result => {
      if (result.value) window.location = '/login';
    });
  };

  return (
    <Layout>
      <div className="change-password">
        <div className="card">
          <div className="title">
            <div className="title-name">Forgot Password</div>
            <div className="title-line" />
          </div>

          <div className="info">
            Forgot your password? Please enter your New Password below
          </div>

          <TextFieldComponent
            id="new-password"
            type="password"
            name="new-password"
            label="New Password"
            className="form-field"
            placeholder="*********"
          />

          <TextFieldComponent
            id="retype-new-password"
            type="password"
            name="retype-new-password"
            label="Retype New Password"
            className="form-field"
            placeholder="*********"
          />

          <div className="info">Captcha code</div>
          <div className="captcha-code" />

          <TextFieldComponent
            id="captcha"
            type="text"
            name="captcha"
            label="Enter captcha"
            className="form-field"
            placeholder="6zzdryn3"
          />
        </div>

        <div className="button-section">
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ChangePassword;
