import React from 'react';
import PropTypes from 'prop-types';
import './Wizard.scss';

function Wizard({ formSteps, onSelectStep, clickableSteps }) {
  const size = formSteps.length;
  const width = 100 / size;
  return (
    <div className="row" id="wizard">
      <div className="col-12 px-0">
        <div id="Wizard" className="row">
          {formSteps.map((x, i) => {
            return (
              <div
                key={x.id}
                className={`stepwizard-step ${x.status}`}
                style={{ width: `${width}%` }}
                onKeyDown={() =>
                  clickableSteps > 0
                    ? i + 1 <= clickableSteps && onSelectStep(i)
                    : x.isSaved && onSelectStep(i)
                }
                onClick={() =>
                  clickableSteps > 0
                    ? i + 1 <= clickableSteps && onSelectStep(i)
                    : x.isSaved && onSelectStep(i)
                }
                tabIndex="0"
                role="button"
              >
                <div className="btn  btn-circle active-step">{i + 1}</div>
                <p className="mt-3">{x.title.split('/')}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Wizard.defaultProps = {
  clickableSteps: 0,
};

Wizard.propTypes = {
  formSteps: PropTypes.instanceOf(Array).isRequired,
  onSelectStep: PropTypes.func.isRequired,
  clickableSteps: PropTypes.number,
};

export default Wizard;
