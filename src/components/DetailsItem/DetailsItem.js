import React from 'react';
import PropTypes, { number } from 'prop-types';
import './DetailsItem.scss';

const DetailsItem = ({ children, className, itemLabel, itemValue }) => {
  return (
    <div className={`detail-item ${className}`}>
      <div className="detail-item-label">{itemLabel}</div>
      {itemValue ? <div className="detail-item-content">{itemValue}</div> : ''}
      {children}
    </div>
  );
};

DetailsItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]),
  className: PropTypes.string,
  itemLabel: PropTypes.string,
  itemValue: PropTypes.oneOfType([PropTypes.string, PropTypes, number]),
};

DetailsItem.defaultProps = {
  children: null,
  className: '',
  itemLabel: '',
  itemValue: '',
};

export default DetailsItem;
