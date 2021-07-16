/**
 *  LabelWithIcon: We can create label with icon  
 * 
    label: '', // what we want to show
    className: '', // className if we want to add extra styling
    icon: '', // icon which we want to show
    handleClick: '', // handle click this component
 */
import React from 'react';
import PropTypes from 'prop-types';
import './LabelWithIcon.scss';
import plusIcon from '../../images/plus/plus.png';

const LabelWithIcon = props => {
  const { handleClick, icon, label, className } = props;
  return (
    <div className={className}>
      <div
        className="label-with-icon"
        role="button"
        tabIndex={-1}
        onClick={handleClick}
        onKeyDown={null}
      >
        <span className="pr-2 cursor label-text">{label}</span>
        <img alt={`${label} `} className="label-icon cursor" src={icon} />
      </div>
    </div>
  );
};

export default LabelWithIcon;

LabelWithIcon.defaultProps = {
  label: '',
  className: '',
  icon: `${plusIcon}`,
  handleClick: () => {},
};

LabelWithIcon.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  handleClick: PropTypes.func,
};
