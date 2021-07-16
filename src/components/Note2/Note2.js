import React from 'react';
import PropTypes from 'prop-types';
import informationIcon from '../../images/alerts/info/information2.png';
import './Note2.scss';

const Note2 = ({ noteText, noteHeight, iconSize }) => {
  return (
    <div className="note2-div" style={{ height: noteHeight }}>
      <img
        className="icon-color"
        height={iconSize}
        width={iconSize}
        alt="info icon"
        src={informationIcon}
      />
      <div className="note2-text">
        <p>{noteText}</p>
      </div>
    </div>
  );
};

export default Note2;

Note2.defaultProps = {
  noteText: '',
  noteHeight: '52px',
  iconSize: '28px',
};

Note2.propTypes = {
  noteText: PropTypes.string,
  noteHeight: PropTypes.string,
  iconSize: PropTypes.string,
};
