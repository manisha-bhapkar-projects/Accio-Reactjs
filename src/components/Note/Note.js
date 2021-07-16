import React from 'react';
import PropTypes from 'prop-types';
import informationIcon from '../../images/alerts/info/information.png';
import './Note.scss';

const Note = ({ noteText, noteHeight, iconSize }) => {
  return (
    <div className="note-div" style={{ height: noteHeight }}>
      <img
        className="icon-color"
        height={iconSize}
        width={iconSize}
        alt="info icon"
        src={informationIcon}
      />
      <div className="note-text">
        <p>{noteText}</p>
      </div>
    </div>
  );
};

export default Note;

Note.defaultProps = {
  noteText: '',
  noteHeight: '52px',
  iconSize: '28px',
};

Note.propTypes = {
  noteText: PropTypes.string,
  noteHeight: PropTypes.string,
  iconSize: PropTypes.string,
};
