import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import './LinksWizard.scss';

function LinksWizard({ formSteps, onSelectStep, className, clickableSteps }) {
  const { t } = useTranslation();

  return (
    <div id="links-wizard" className={className}>
      {formSteps.map((x, i) => {
        return (
          <div
            key={x.id}
            className={`links-wizard-step ${x.status}`}
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
            tabIndex="-1"
            role="button"
          >
            {/* {x.title} */}
            {t(x.title)}
          </div>
        );
      })}
    </div>
  );
}

LinksWizard.defaultProps = {
  className: '',
  clickableSteps: 0,
};

LinksWizard.propTypes = {
  formSteps: PropTypes.instanceOf(Array).isRequired,
  onSelectStep: PropTypes.func.isRequired,
  className: PropTypes.string,
  clickableSteps: PropTypes.number,
};

export default LinksWizard;
