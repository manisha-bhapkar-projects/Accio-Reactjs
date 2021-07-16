import React, { useState } from 'react';
import './Login.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, useHistory } from 'react-router-dom';
import LoginLayout from '../../components/LoginLayout/LoginLayout';
import TextFieldComponent from '../../components/TextFieldComponent/TextFieldComponent';
// import ErrorAlert from '../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import callLoginApiAction from '../../actions/loginAction';
import { getUserLanguagesListAPIAction } from '../../actions/commonActions';
import messages from '../../utils/Locales/messages';

import {
  storeUserMetaData,
  storeAuthRefreshToken,
  storeAuthToken,
  storeUserCompanies,
} from '../../utils/storage';
import constant from '../../utils/constants';
import { validateEmail } from '../../utils/validation';
import DropdownComponentWithSearchBar from '../../components/Dropdown/DropdownComponentWithSearchBar';
// import companyList from '../../utils/DemoData/companyList';

function Login({ callLoginApi, getUserLanguagesListAPI }) {
  const withRegisterLink = false;
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectCompanyValue, setSelectCompanyValue] = useState('');
  const [response, setResponse] = useState('');
  const [companyList, setCompanyList] = useState('');
  const [screen, setScreen] = useState('login');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [popupErrorMessage, setPopupMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isErrorCompany, setIsErrorCompany] = useState(false);

  // console.log('Login Type', email, password);
  // if valid then it return true otherwise false
  const validateLoginForm = () => {
    if (!email || !password) {
      if (!email) {
        setEmailError(messages.LOGIN.ERR_USERNAME_MANDATORY);
      }
      if (!password) {
        setPasswordError(messages.LOGIN.ERR_PASSWORD_MANDATORY);
      }
      return false;
    }
    if (email) {
      if (!validateEmail(email)) {
        setEmailError(messages.GLOBAL.ERR_EMAIL_INPUT);
        return false;
      }
    }

    return true;
  };

  const handleLogin = e => {
    e.preventDefault();
    const request = {
      email,
      password,
    };

    const isValid = validateLoginForm();

    if (isValid) {
      callLoginApi(request)
        .then(_response => {
          if (_response.data.success) {
            if (
              _response.data.data[0].uMetaData.companies.length
              // ||
              // _response.data.data[0].uMetaData.uType === 'Tenant'
            ) {
              setEmail('');
              setPassword('');
              setResponse(_response.data.data[0]);
              setCompanyList(
                _response.data.data[0].uMetaData.companies.map(x => {
                  const comp = {
                    id: x.companyId,
                    value: x.companyName,
                  };
                  return comp;
                }),
              );
              setScreen('Select Company');

              if (_response.data.data[0].uMetaData.companies.length === 1) {
                setSelectCompanyValue(
                  _response.data.data[0].uMetaData.companies[0].companyName,
                );
                storeUserCompanies(
                  JSON.stringify(
                    _response.data.data[0].uMetaData.companies.map(x => {
                      const comp = {
                        id: x.companyId,
                        value: x.companyName,
                      };
                      return comp;
                    })[0],
                  ),
                );
                setScreen('Select Company');
                return null;
              }
            }
            storeUserMetaData(JSON.stringify(_response.data.data[0].uMetaData));
            storeAuthToken(_response.data.data[0].token);
            storeAuthRefreshToken(_response.data.data[0].refreshToken);
            storeUserCompanies(null);
            setEmail('');
            setPassword('');
            getUserLanguagesListAPI();
            history.push(constant.ROUTE.DASHBORD.DASHBORD);
            return null;
          }
          throw new Error(_response.data.message);
        })
        .catch(() => {
          setPopupMessage(messages.LOGIN.INVALID_USERNAME_PASSWORD);
          setIsErrorMessage(true);
        });
    }
  };

  const handleUsernameChange = e => {
    setIsErrorMessage(false);
    setPopupMessage('');
    setEmailError('');
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setIsErrorMessage(false);
    setPasswordError('');
    setPopupMessage('');
    setPassword(e.target.value);
  };

  const selectCompanyValueIndex = item => {
    if (isErrorCompany) {
      setIsErrorCompany(false);
    }
    setSelectCompanyValue(item.value);
    storeUserCompanies(JSON.stringify(item));
  };
  const handleSubmitDropdown = e => {
    e.preventDefault();
    if (selectCompanyValue) {
      storeUserMetaData(JSON.stringify(response.uMetaData));
      storeAuthToken(response.token);
      storeAuthRefreshToken(response.refreshToken);
      getUserLanguagesListAPI();
      history.push(constant.ROUTE.DASHBORD.DASHBORD);
    } else {
      setIsErrorCompany(true);
    }
  };
  return (
    <LoginLayout>
      <div className="login">
        {/* {isErrorMessage ? (
          <div className="common-error-div">{popupErrorMessage}</div>
        ) : (
          ''
        )} */}

        <div className="common-error-div">{popupErrorMessage || ''}</div>
        {screen === 'login' ? (
          <form noValidate autoComplete="off">
            <div>
              <TextFieldComponent
                id="email"
                type="text"
                name="email"
                label="Username"
                labelClassName="login-input-label"
                inputClassName="input-text"
                className="login-field"
                placeholder="Enter username"
                value={email}
                // onChange={e => setEmail(e.target.value)}
                onChange={handleUsernameChange}
                error={emailError || isErrorMessage}
                helperText={emailError || ''}
                autoFocus
              />
            </div>
            <div>
              <TextFieldComponent
                id="password"
                type="password"
                name="password"
                label="Password"
                labelClassName="login-input-label"
                inputClassName="input-text"
                className="login-field"
                placeholder="Enter password"
                value={password}
                // onChange={e => setPassword(e.target.value)}
                onChange={handlePasswordChange}
                error={passwordError || isErrorMessage}
                helperText={passwordError || ''}
              />
            </div>
            <div className="login-navs">
              <Link to="/forgotpassword">
                <span className="forgot-password-text">Forgot Password?</span>
              </Link>
            </div>
            {!withRegisterLink ? (
              <>
                <br />
              </>
            ) : (
              ''
            )}
            <button
              type="submit"
              className="btn btn-block btn-primary"
              // disabled={!(email && password)}
              onClick={handleLogin}
            >
              Login
            </button>

            {withRegisterLink ? (
              <>
                <br />
                <Link to="/">
                  <p className="login-navs">
                    <span>Don&apos;t have an account? </span>Register here
                  </p>
                </Link>
                <br />
              </>
            ) : (
              ''
            )}
          </form>
        ) : (
          <form
            noValidate
            autoComplete="off"
            className="dropdown-submit align-self-center"
          >
            <div className="select-company">
              <DropdownComponentWithSearchBar
                data={companyList}
                label="Select Company"
                value={selectCompanyValue}
                drop="down"
                filterDropdown={false}
                className="login-field"
                onSelect={index => {
                  selectCompanyValueIndex(
                    companyList.filter(x => {
                      return x.id === index;
                    })[0],
                  );
                }}
                // inputClassName="input-text"
                labelClassName="login-input-label"
                noOptionsMessage=""
                error={isErrorCompany}
                isDisabled={false}
                placeholder="Select Company"
              />
            </div>
            <div className="login-navs">
              <button
                type="submit"
                className="btn btn-block btn-primary"
                // disabled={!(email && password)}
                onClick={handleSubmitDropdown}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      {/* <ErrorAlert
        alertMessage={popupErrorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      /> */}
    </LoginLayout>
  );
}

Login.propTypes = {
  callLoginApi: PropTypes.func.isRequired,
  getUserLanguagesListAPI: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      callLoginApi: callLoginApiAction,
      getUserLanguagesListAPI: getUserLanguagesListAPIAction,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Login);
