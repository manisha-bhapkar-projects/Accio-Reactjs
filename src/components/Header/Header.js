import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import accioLogo from '../../images/logo/main.png';
import './header.scss';
import {
  getUserPropertiesAPIAction,
  setSearchText,
} from '../../actions/headerAction';
import {
  getUserLanguagesListAPIAction,
  resetLanguages,
} from '../../actions/commonActions';
import { getCaseListDetailsAPIAction } from '../../actions/Business/caseListingAction';
import NavbarMenus from './NavbarMenus';

function Home({
  getUserPropertiesAPI,
  userAccessPropertiesList,
  getUserLanguagesListAPI,
  resetLanguagesAction,
  searchText,
  setSearchTextAction,
  getCaseListDetailsAPI,
}) {
  const isAuthenticated = true;
  useEffect(() => {
    getUserPropertiesAPI();
  }, []);
  return (
    <>
      <div className="accio-navbar">
        <nav className="navbar accio-navbar-main">
          <Link to="/accio/" style={{ textDecoration: 'none' }}>
            <div className="navbar-brand accio-header">
              <img src={accioLogo} alt="accio" />
            </div>
          </Link>
          {isAuthenticated ? (
            <NavbarMenus
              userAccessPropertiesList={userAccessPropertiesList}
              getUserLanguagesListAPI={getUserLanguagesListAPI}
              resetLanguagesAction={resetLanguagesAction}
              searchText={searchText}
              setSearchTextAction={setSearchTextAction}
              getCaseListDetailsAPI={getCaseListDetailsAPI}
            />
          ) : (
            ''
          )}
        </nav>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  userAccessPropertiesList: state.header.propertyAccessList,
  searchText: state.header.searchText,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserPropertiesAPI: getUserPropertiesAPIAction,
      getUserLanguagesListAPI: getUserLanguagesListAPIAction,
      resetLanguagesAction: resetLanguages,
      setSearchTextAction: setSearchText,
      getCaseListDetailsAPI: getCaseListDetailsAPIAction,
    },
    dispatch,
  );

Home.propTypes = {
  userAccessPropertiesList: PropTypes.instanceOf(Array).isRequired,
  getUserPropertiesAPI: PropTypes.func.isRequired,
  getUserLanguagesListAPI: PropTypes.func.isRequired,
  resetLanguagesAction: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  setSearchTextAction: PropTypes.func.isRequired,
  getCaseListDetailsAPI: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
