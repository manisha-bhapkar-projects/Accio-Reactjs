import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchComponent from '../SearchComponent/SearchComponent';
import Notification from '../Notification/Notification';
import AccountDropdown from './AccountDropdown/AccountDropdown';
import { setUserPropertyId, getPropId } from '../../utils/storage/index';
import constants from '../../utils/constants';

function NavbarMenus({
  userAccessPropertiesList,
  getUserLanguagesListAPI,
  resetLanguagesAction,
  searchText,
  setSearchTextAction,
  getCaseListDetailsAPI,
  propertyUserAppStatus,
}) {
  const history = useHistory();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const langauges = [
    { key: 'en', text: 'English', value: 'en' },
    { key: 'fr', text: 'French', value: 'fr' },
    { key: 'hn', text: 'Hindi', value: 'hn' },
    { key: 'zh', text: 'Chinese', value: 'zh' },
  ];

  const onSearchListener = e => {
    setSearchTextAction(e.target.value);
    const reqObj = {
      search: e.target.value,
    };
    getCaseListDetailsAPI(reqObj, 1, 10);
  };

  const handlePropertyChange = (e, data) => {
    setUserPropertyId(data.value);
    resetLanguagesAction();
    getUserLanguagesListAPI();
    history.push(constants.ROUTE.DASHBORD.DASHBORD);
  };

  const handleLanguageChange = (e, data) => {
    i18n.changeLanguage(data.value);
    setLanguage(data.value);
  };

  return (
    <div className="navbar-right-content">
      <div className="each">
        <SearchComponent
          searchText={searchText}
          onSearchListener={onSearchListener}
        />
      </div>
      {propertyUserAppStatus === constants.STORAGE.AUTH.USER_APP_TYPE_ADMIN ? (
        <div className="each">
          <Dropdown
            selection
            options={userAccessPropertiesList}
            defaultValue={getPropId()}
            className="lang-dropdown"
            onChange={(e, data) => {
              handlePropertyChange(e, data);
            }}
          />{' '}
        </div>
      ) : (
        <div className="each">
          <Dropdown
            selection
            options={langauges}
            value={language}
            defaultValue="en"
            className="lang-dropdown"
            onChange={(e, data) => {
              handleLanguageChange(e, data);
            }}
          />
        </div>
      )}

      <div className="each">
        <Notification />
      </div>
      <div className="line each" />
      <div className="each">
        <AccountDropdown />
      </div>
    </div>
  );
}

NavbarMenus.propTypes = {
  searchText: PropTypes.string.isRequired,
  setSearchTextAction: PropTypes.func.isRequired,
  getCaseListDetailsAPI: PropTypes.func.isRequired,
  userAccessPropertiesList: PropTypes.instanceOf(Array).isRequired,
  getUserLanguagesListAPI: PropTypes.func.isRequired,
  resetLanguagesAction: PropTypes.func.isRequired,
  propertyUserAppStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  userAccessPropertiesList: state.header.propertyAccessList,
  propertyUserAppStatus: state.header.propertyUserAppStatus,
});

export default connect(mapStateToProps, null)(NavbarMenus);
