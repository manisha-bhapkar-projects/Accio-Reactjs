import React from 'react';
import PropTypes from 'prop-types';
import './Searchbar.scss';

function Searchbar({ searchText, onSearchListner, className }) {
  return (
    <div className="searchbar-component">
      <input
        id="search-header"
        className={`search-bar ${className}`}
        type="text"
        placeholder="Search..."
        value={searchText}
        autoComplete="off"
        onChange={onSearchListner}
      />
    </div>
  );
}

Searchbar.propTypes = {
  searchText: PropTypes.string,
  onSearchListner: PropTypes.func,
  className: PropTypes.string,
};

Searchbar.defaultProps = {
  searchText: '',
  onSearchListner: () => {},
  className: '',
};
export default Searchbar;
