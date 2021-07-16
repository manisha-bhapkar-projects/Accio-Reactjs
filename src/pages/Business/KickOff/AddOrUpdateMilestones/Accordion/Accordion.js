import React from 'react';
import PropTypes from 'prop-types';
import Chevron from './Chevron/Chevron';
import './Accordion.scss';

function Accordion(props) {
  const {
    headerComponent,
    contentComponent,
    isDisabled,
    isContent,
    // isError,
    toggleAccordion,
    previewStatus,
  } = props;
  // console.log(props);
  // const content = useRef(null);
  // const [setActive] = useState(previewStatus ? '' : 'active');
  // const [setHeight] = useState(previewStatus ? '0px' : 'auto');
  // const [setRotate] = useState(
  //   previewStatus ? 'accordion__icon rotate' : 'accordion__icon',
  // );
  // console.log(previewStatus);
  return (
    <div className="accordion__section">
      <button
        type="button"
        className={`${
          isDisabled || !(contentComponent && contentComponent !== <></>)
            ? 'custom-accordion-without-chevron'
            : 'custom-accordion-with-chevron'
        } ${previewStatus ? 'active' : ''}`}
        // onClick={toggleAccordion}
        disabled={isDisabled}
      >
        <>{headerComponent}</>
        {isContent && (
          <Chevron
            onClick={toggleAccordion}
            className={` ${
              previewStatus ? 'accordion__icon rotate' : 'accordion__icon'
            } cursor`}
          />
        )}
      </button>
      {isContent && (
        <div
          // ref={content}
          style={{
            maxHeight: `${previewStatus ? '1000px' : '0px'}`,
            overflow: `${previewStatus ? 'visible' : 'hidden'}`,
          }}
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
  // isError: false,
  previewStatus: false,
};

Accordion.propTypes = {
  headerComponent: PropTypes.instanceOf(Object),
  contentComponent: PropTypes.instanceOf(Object),
  isDisabled: PropTypes.bool,
  isContent: PropTypes.bool,
  // isError: PropTypes.bool,
  toggleAccordion: PropTypes.func.isRequired,
  previewStatus: PropTypes.bool,
};
