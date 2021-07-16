import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

const Header = props => {
  const { phase, isPrerequistes, handlePrequisitePopup } = props;
  // console.log(
  //   'Header prerequistes',
  //   phase,
  //   isPrerequistes,
  //   handlePrequisitePopup,
  // );
  return (
    <div
      className={
        isPrerequistes
          ? 'accordion-header-title text-color-prerequistes'
          : 'accordion-header-title'
      }
      onClick={isPrerequistes ? handlePrequisitePopup : null}
      onKeyDown={isPrerequistes ? handlePrequisitePopup : null}
      tabIndex="0"
      role="button"
    >
      {phase}
    </div>
  );
};

export default Header;

Header.defaultProps = {
  phase: '',
  isPrerequistes: false,
  handlePrequisitePopup: '',
};

Header.propTypes = {
  phase: PropTypes.string,
  isPrerequistes: PropTypes.bool,
  handlePrequisitePopup: PropTypes.func,
};
