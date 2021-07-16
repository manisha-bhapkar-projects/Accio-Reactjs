/**
 * Step2 :
 *  Review and update dates
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';

import './Step2.scss';
import { scrollToTop } from '../../../../../utils/utils';

const Step2 = () => {
  // scroll page to the top
  useEffect(() => {
    scrollToTop();
  }, []);
  return <div className="review-and-update-dates">step 2</div>;
};

export default Step2;

// Step2.defaultProps = {
//   notes: '',
// };

// Step2.propTypes = {
//   notes: PropTypes.string,
//   changeNotes: PropTypes.func.isRequired,
// };
