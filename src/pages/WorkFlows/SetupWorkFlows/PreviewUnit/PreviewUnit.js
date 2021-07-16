import React from 'react';
import './PreviewUnit.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CardHeader from '../../../../components/CardHeader/CardHeader';
import Accordion from './Accordion/Accordion';
import Header from '../Header/Header';
import SubComponent from './SubComponent/SubComponent';
// import LanguageSwitcher from '../../../../components/LanguageSwitcher/LanguageSwitcher';

function PreviewUnit({
  handleClosePopup,
  dataList,
  toggleAccordion,
  preview,
  activeLanguage,
}) {
  const { t } = useTranslation();

  return (
    <div className="preview-unit">
      <CardHeader
        title={`${t('ADMIN.WORKFLOW.PREVIEW')} ${preview} ${t(
          'ADMIN.WORKFLOW.PRE-REQUISITES',
        )}`}
      />
      {/* <LanguageSwitcher
        className="design-form-language-switcher mb-3"
        onClick={handleLanguageSwitch}
        activeLanguage={activeLanguage}
        languages={languages}
      /> */}
      {dataList.map(x => {
        return (
          <Accordion
            key={x.refId}
            headerComponent={
              <Header
                phase={`${
                  x.names && x.names.length
                    ? x.names.filter(
                        ({ languageCode }) => languageCode === activeLanguage,
                      )[0].name
                    : ''
                }`}
              />
            }
            isContent
            contentComponent={
              <SubComponent
                subComponentData={x}
                activeLanguage={activeLanguage}
              />
            }
            previewStatus={x.status}
            toggleAccordion={() => {
              toggleAccordion(x.refId);
            }}
          />
        );
      })}

      <div className="submit-buttom-section">
        <button
          type="button"
          className="btn-submit btn-primary btn"
          onClick={handleClosePopup}
        >
          Close
        </button>
      </div>
    </div>
  );
}

PreviewUnit.propTypes = {
  handleClosePopup: PropTypes.func.isRequired,
  dataList: PropTypes.instanceOf(Array).isRequired,
  toggleAccordion: PropTypes.func.isRequired,
  preview: PropTypes.string.isRequired,
  // languages: PropTypes.string.isRequired,
  // handleLanguageSwitch: PropTypes.func.isRequired,
  activeLanguage: PropTypes.instanceOf(Array).isRequired,
};
export default PreviewUnit;
