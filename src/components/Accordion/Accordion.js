import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chevron from './Chevron/Chevron';
import './Accordion.scss';

function Accordion(props) {
  const {
    headerComponent,
    contentComponent,
    isDisabled,
    isContent,
    isError,
    // previewStatus,
  } = props;
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');
  const [setRotate, setRotateState] = useState('accordion__icon');

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(
      setActive === 'active'
        ? '0px'
        : `${content.current && content.current.scrollHeight}px`,
    );
    setRotateState(
      setActive === 'active' ? 'accordion__icon' : 'accordion__icon rotate',
    );
  }

  useEffect(() => {
    if (content.current)
      if (setActive === 'active')
        setHeightState(`${content.current && content.current.scrollHeight}px`);
  }, [contentComponent, setActive, content]);

  useEffect(() => {
    if (isError && setActive !== 'active') {
      toggleAccordion();
    }
  }, [isError]);

  return (
    <div className="accordion__section">
      <button
        type="button"
        className={`${
          isDisabled || !(contentComponent && contentComponent !== <></>)
            ? 'custom-accordion-without-chevron'
            : 'custom-accordion-with-chevron'
        } ${setActive}`}
        onClick={toggleAccordion}
        disabled={isDisabled}
      >
        <>{headerComponent}</>
        {isContent && <Chevron className={` ${setRotate}`} />}
      </button>
      {isContent && (
        <div
          ref={content}
          style={{ maxHeight: `${setHeight}` }}
          className="accordion__content"
        >
          {contentComponent}
        </div>
      )}
    </div>
  );
}

export default Accordion;

Accordion.defaultProps = {
  headerComponent: <></>,
  contentComponent: null,
  isDisabled: false,
  isContent: false,
  isError: false,
  // previewStatus: false,
};

Accordion.propTypes = {
  headerComponent: PropTypes.instanceOf(Object),
  contentComponent: PropTypes.instanceOf(Object),
  isDisabled: PropTypes.bool,
  isContent: PropTypes.bool,
  isError: PropTypes.bool,
  // previewStatus: PropTypes.bool,
};
