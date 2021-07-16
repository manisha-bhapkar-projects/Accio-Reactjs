import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Alerts.scss';
import success from '../../images/alerts/success/success.png';
import close from '../../images/close button/close.png';

const MySwal = withReactContent(Swal);

export const AlertTitle = ({ titleProp }) => (
  <div className="alert-heading">
    <div className="alert-heading-name">{titleProp}</div>
    <div className="alert-heading-line" />
  </div>
);

export const AlertText = ({ children }) => (
  <div className="alert-text">{children}</div>
);

export const SuccessAlert = MySwal.mixin({
  imageUrl: success,
  animation: false,
  showCloseButton: true,
  closeButtonHtml: `<img src=${close} alt='x' />`,
  buttonsStyling: false,
  customClass: {
    container: 'alert-container-class',
    image: 'image-class',
    title: 'title-class',
    popup: 'popup-class',
    closeButton: 'close-class',
    confirmButton: 'btn btn-primary',
    content: 'content-class',
  },
});

AlertText.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
};

AlertTitle.propTypes = {
  titleProp: PropTypes.string.isRequired,
};
