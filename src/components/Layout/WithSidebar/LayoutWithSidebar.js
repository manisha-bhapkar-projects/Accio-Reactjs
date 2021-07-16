import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './LayoutWithSidebar.scss';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import Footer from '../../Footer/Footer';
import SidebarBusiness from '../../SidebarBusiness/SidebarBusiness';
import CaseListing from '../../../pages/Business/CaseListing/CaseListing';

function LayoutWithSidebar({
  children,
  sidebarActiveProp,
  searchText,
  getUserAppStatusState,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main-layout">
      <header>
        <Header />
      </header>
      {searchText.length > 0 ? (
        <div className="content">
          <CaseListing />
        </div>
      ) : (
        <>
          <nav className={`nav-left sidebar ${sidebarActiveProp}`}>
            {/* <Sidebar /> */}
            {getUserAppStatusState === 'admin' ? (
              <Sidebar />
            ) : (
              <SidebarBusiness />
            )}
          </nav>
          <section className={`middle-wrapper-section ${sidebarActiveProp}`}>
            <section className="middle-layout">
              <section className="inner-section">
                <article className={`main-content ${sidebarActiveProp}`}>
                  {children}
                </article>
              </section>
            </section>
          </section>
        </>
      )}
      <Footer />
    </div>
  );
}
LayoutWithSidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  sidebarActiveProp: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  getUserAppStatusState: PropTypes.string.isRequired,
};

function mapStateToProps({ sidebarActive, header }) {
  return {
    sidebarActiveProp: sidebarActive,
    searchText: header.searchText,
    getUserAppStatusState: header.propertyUserAppStatus,
  };
}
export default connect(mapStateToProps)(LayoutWithSidebar);
