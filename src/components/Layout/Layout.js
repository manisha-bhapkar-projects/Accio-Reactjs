import React from 'react';
import PropTypes from 'prop-types';
import './Layout.scss';

import { connect } from 'react-redux';
import Headers from '../Header/Header';
import CaseListing from '../../pages/Business/CaseListing/CaseListing';

function Layout({ children, searchText }) {
  return (
    <div className="layout">
      <div className="header">
        <Headers />
      </div>
      {/* <Sidebar /> */}
      {searchText.length > 0 ? (
        <div className="content">
          <CaseListing />
        </div>
      ) : (
        <div className="content">{children}</div>
      )}
      <div className="footer-layout">
        <div className="footer-content">© thinkhance. All rights reserved.</div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  searchText: state.header.searchText,
});

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  searchText: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(Layout);
