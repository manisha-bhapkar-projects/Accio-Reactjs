import React from 'react';
import PropTypes from 'prop-types';
import './LanguageSwitcher.scss';

import labels from '../../utils/Locales/labels';

const LanguageSwitcher = props => {
  const { languages, activeLanguage, onClick, className } = props;
  return (
    <>
      {languages.length > 1 ? (
        <div className={`language-switcher ${className}`}>
          <div>{labels.COMPONENTS.LANGUAGE_SWITCHER.LABEL}</div>
          {languages.map(language => {
            if (language.languageCode !== activeLanguage) {
              return (
                <div
                  key={language.languageCode}
                  className="language-label"
                  role="button"
                  tabIndex={-1}
                  onClick={() => onClick(language.languageCode)}
                  onKeyDown={null}
                >
                  {language.languageName}
                </div>
              );
            }
            return '';
          })}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default LanguageSwitcher;

LanguageSwitcher.defaultProps = {
  className: '',
  onClick: () => {},
  activeLanguage: '',
};

LanguageSwitcher.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  activeLanguage: PropTypes.string,
  languages: PropTypes.instanceOf(Array).isRequired,
};
