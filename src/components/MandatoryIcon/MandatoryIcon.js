import React from 'react';
import PropTypes from 'prop-types';
import MandatoryImg from '../../images/mandatory/mandatory.png';
import OverlayToolTip from '../OverlayToolTip/OverlayToolTip';
import labels from '../../utils/Locales/labels';

const MandatoryIcon = ({ label }) => {
  return (
    <OverlayToolTip position="bottom" label={label}>
      <img alt="mandatory" className="mandatory-icon" src={MandatoryImg} />
    </OverlayToolTip>
  );
};

export default MandatoryIcon;

MandatoryIcon.defaultProps = {
  label: labels.GLOBAL.THIS_FIELD_IS_MANDATORY,
};

MandatoryIcon.propTypes = {
  label: PropTypes.string,
};
