import React from 'react';
import PropTypes from 'prop-types';
import './Switch.scss';

const Switch = ({ id, handleToggle, isDisabled, ...rest }) => {
  return (
    <>
      <div
        className={
          isDisabled ? 'btn-disable switch-container' : 'switch-container'
        }
      >
        <label htmlFor="switch">
          <input
            id={id}
            disabled={isDisabled}
            title={isDisabled ? 'Disabled' : ''}
            onChange={handleToggle}
            className="switch"
            type="checkbox"
            {...rest}
          />
          <div>
            <div />
          </div>
        </label>
        {isDisabled ? (
          <div className="cant-disabled">Cannot be disabled</div>
        ) : null}
      </div>
    </>
  );
};

export default Switch;

Switch.defaultProps = {
  handleToggle: null,
  isDisabled: false,
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  handleToggle: PropTypes.func,
  isDisabled: PropTypes.bool,
};
