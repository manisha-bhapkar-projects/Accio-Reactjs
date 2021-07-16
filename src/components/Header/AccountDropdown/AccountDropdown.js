import React from 'react';
import PropTypes from 'prop-types';
import './AccountDropdown.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  storeUserMetaData,
  storeAuthRefreshToken,
  storeUserCompanies,
  storeAuthToken,
  getUserMetaData,
  storeUserAppStatus,
  getAppAccessList,
} from '../../../utils/storage';
import { setpropappStatus } from '../../../actions/headerAction';
import constants from '../../../utils/constants';
import { logoutApiAction } from '../../../actions/loginAction';

function AccountDropdown({ setpropappStatusAction, logoutApi }) {
  const userData = JSON.parse(getUserMetaData());
  const history = useHistory();
  const { i18n } = useTranslation();
  const getDropdown = () => {
    const userAccessList = getAppAccessList();
    if (userAccessList.length !== 0) {
      const dropdownItemsJSX = [];
      if (userAccessList.includes('admin')) {
        dropdownItemsJSX.push(
          <>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => {
                i18n.changeLanguage('en');
                setpropappStatusAction(
                  constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN,
                );
                storeUserAppStatus(constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN);
                history.push(constants.ROUTE.DASHBORD.DASHBORD);
              }}
            >
              My Account
            </button>
          </>,
        );
      }
      if (
        userAccessList.includes('full') ||
        userAccessList.includes('case') ||
        userAccessList.includes('workflow')
      ) {
        dropdownItemsJSX.push(
          <>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => {
                setpropappStatusAction(
                  constants.STORAGE.AUTH.USER_APP_TYPE_BUSINESS,
                );
                storeUserAppStatus(
                  constants.STORAGE.AUTH.USER_APP_TYPE_BUSINESS,
                );
                history.push(constants.ROUTE.DASHBORD.DASHBORD);
              }}
            >
              Business Account
            </button>
          </>,
        );
      }

      return dropdownItemsJSX;
    }
    return [];
  };

  return (
    <div className="acc-dropdown">
      <div className="dropdown">
        <button
          className="btn btn-block acc-dropdown-btn"
          type="button"
          id="account-dropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="dropdown-label">
            {userData ? userData.initial : ''}
          </span>
        </button>

        <div
          className="dropdown-menu account-dropdown-menu-admin"
          aria-labelledby="dropdownMenu2"
        >
          {getDropdown()}
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              logoutApi()
                .then(_response => {
                  // console.log(_response);
                  storeUserMetaData(null);
                  storeAuthToken(null);
                  storeAuthRefreshToken(null);
                  storeUserAppStatus(null);
                  storeUserCompanies(null);
                  history.push('/');
                })
                .catch(_error => {
                  // console.log(_error);
                });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

AccountDropdown.propTypes = {
  setpropappStatusAction: PropTypes.func.isRequired,
  logoutApi: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setpropappStatusAction: setpropappStatus,
      logoutApi: logoutApiAction,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(AccountDropdown);
