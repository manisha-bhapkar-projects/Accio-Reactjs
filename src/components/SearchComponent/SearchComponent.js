import React, { useState } from 'react';
import PropTypes from 'prop-types';
import searchIcon from '../../images/search/search-copy.png';
import './SearchComponent.scss';

function SearchComponent({ searchText, onSearchListener }) {
  const [isSearchCLicked, setIsSearchClicked] = useState(false);

  const showSearchBar = () => {
    setIsSearchClicked(true);
  };

  return (
    <div className="search-component">
      {isSearchCLicked ? (
        <div className="header-searchbar">
          <input
            id="search-header"
            className="search-bar"
            type="text"
            placeholder="Search..."
            value={searchText}
            autoComplete="off"
            onChange={onSearchListener}
          />
        </div>
      ) : (
        <button type="button" onClick={showSearchBar} className="search-btn">
          <img src={searchIcon} alt="Search..." />
        </button>
      )}
    </div>
  );
}

SearchComponent.propTypes = {
  searchText: PropTypes.string,
  onSearchListener: PropTypes.func,
};

SearchComponent.defaultProps = {
  searchText: '',
  onSearchListener: () => {},
};

export default SearchComponent;
