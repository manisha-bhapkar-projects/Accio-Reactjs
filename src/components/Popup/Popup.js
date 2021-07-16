/**
 * Popup:
 *
 * open:  //open popup
 * setClose // function to close popup
 * children // child data to show content
 * title  // title of popup
 * scrollType // papper( provides scrollbar) / body(provide content full body)
 *
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import closeIcon from '../../images/close button/close.png';
import './Popup.scss';

const Popup = props => {
  const { open, setClose, children, scrollType } = props;

  const handleClose = () => {
    setClose(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      className="popup"
      open={open}
      onClose={handleClose}
      scroll={scrollType}
      maxWidth="lg"
      disableScrollLock
    >
      <div className="max-size-popup">
        <div
          className="close-icon"
          role="button"
          tabIndex={0}
          onKeyDown={null}
          onClick={handleClose}
        >
          <img alt="close icon" className="cursor" src={closeIcon} />
        </div>
        <div className="popup-card">
          <>{children}</>
        </div>
      </div>
    </Dialog>
  );
};

export default Popup;

Popup.defaultProps = {
  open: '',
  setClose: '',
  scrollType: '',
};

Popup.propTypes = {
  open: PropTypes.bool,
  setClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  scrollType: PropTypes.string,
};
