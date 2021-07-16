import React from 'react';
import PropTypes from 'prop-types';

function Chevron(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} cursor`}
      viewBox="0 0 17 11"
      height="11px"
      width="17px"
    >
      <path
        fillRule="evenodd"
        d="M8.5 0L17 8.25 15.008 10.183 8.5 3.866 1.992 10.183 0 8.25z"
      />
    </svg>
  );
}

export default Chevron;

Chevron.defaultProps = {
  className: '',
};

Chevron.propTypes = {
  className: PropTypes.string,
};
