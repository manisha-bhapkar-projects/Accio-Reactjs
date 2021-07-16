import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

const Header = props => {
  const { phase, isPrerequistes } = props;
  return (
    <div
      className={
        isPrerequistes
          ? 'accordion-header-title text-color-prerequistes'
          : 'accordion-header-title'
      }
    >
      {phase}
    </div>
  );
};

export default Header;

Header.defaultProps = {
  phase: '',
  isPrerequistes: false,
};

Header.propTypes = {
  phase: PropTypes.string,
  isPrerequistes: PropTypes.bool,
};
