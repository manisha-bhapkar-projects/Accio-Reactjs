import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';
// import infoIcon from '../../images/InfoForTooltip/infoForTooltip.png';

const Checkbox = ({ id, className, labelClassName, label, error, ...rest }) => {
  return (
    <div className={`checkbox-component ${className}`}>
      {label ? (
        <>
          <label
            htmlFor={id}
            className={`input-label ${error ? 'error' : ''} ${labelClassName}`}
          >
            {label}
          </label>
          {/* <img
            src={infoIcon}
            alt=""
            // style={{ height: '12px', width: '12px' }}
          /> */}
        </>
      ) : (
        ''
      )}
      <input type="checkbox" className="checkbox-input" {...rest} />
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
};
Checkbox.defaultProps = {
  id: '',
  label: '',
  labelClassName: '',
  className: '',
  error: false,
};
export default Checkbox;
