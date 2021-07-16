import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './OverlayTrigger.scss';

const OverlayToolTip = ({ label, position, children }) => {
  return (
    <>
      <OverlayTrigger
        key="right"
        placement={position}
        overlay={
          <Tooltip id="tooltip-right">
            <div className="tooltip-text">{label}</div>
          </Tooltip>
        }
      >
        {children}
      </OverlayTrigger>
    </>
  );
};

OverlayToolTip.defaultProps = {
  position: 'right',
};

OverlayToolTip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  label: PropTypes.string.isRequired,
  position: PropTypes.string,
};

export default OverlayToolTip;
