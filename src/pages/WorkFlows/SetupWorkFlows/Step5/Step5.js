import React, { useState, useEffect } from 'react';
import './Step5.scss';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Accordion from '../../../../components/Accordion/Accordion';
import Header from '../Header/Header';
import AdvanceDataTable from '../../../../components/AdvanceDataTable/AdvanceDataTable';
import LanguageSwitcher from '../../../../components/LanguageSwitcher/LanguageSwitcher';
import Popup from '../../../../components/Popup/Popup';
import PreviewUnit from '../PreviewUnit/PreviewUnit';
import {
  callApiPreRequisitesAction,
  setWizardSteps,
} from '../../../../actions/workFlowsAction';
import {
  getSteps,
  getPopupDataSelector,
  getActionTaskNameFromitemStep5,
} from '../../selector';

function Step5({
  data,
  handleLanguageSwitch,
  activeLanguage,
  languages,
  callApiPreRequisites,
  changeStep,
  steps,
  getPopupData,
}) {
  const [columns, setColumns] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  const handlePrequisitePopup = _item => {
    setDataOpen(false);

    const newData = [...steps];

    callApiPreRequisites(_item.groupRefId)
      .then(res => {
        newData[4].preRequisiteItem = res.data.data[0].preRequisites.map(
          item => {
            return { ...item, status: false };
          },
        );
        newData[4].preview =
          res.data.data[0].names && res.data.data[0].names.length
            ? res.data.data[0].names.filter(
                ({ languageCode }) => languageCode === activeLanguage,
              )[0].name
            : '';
        changeStep(newData);
        setDataOpen(true);
      })
      .catch(() => {
        // console.log(error);
      });
    setPopupOpen(true);
  };

  const toggleAccordion = id => {
    const newPopupData = [...steps];
    newPopupData[4].preRequisiteItem.forEach((item, i) => {
      if (item.refId === id) {
        newPopupData[4].preRequisiteItem[i].status = !newPopupData[4]
          .preRequisiteItem[i].status;
      } else {
        newPopupData[4].preRequisiteItem[i].status = false;
      }
    });

    changeStep(newPopupData);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  useEffect(() => {
    if (data.length > 0) {
      const actionTaskColumns = [];
      data.forEach(phase => {
        if (phase.actionTasks && phase.actionTasks.length > 0) {
          const inputColums = [
            {
              minWidth: '100%',
              maxWidth: '100%',
              cell: row => {
                return (
                  <>
                    <span>
                      {getActionTaskNameFromitemStep5(row, activeLanguage)}
                    </span>{' '}
                    {/* className={row.isMandatory ? '' : 'd-none'} */}
                  </>
                );
              },
            },
          ];
          actionTaskColumns[phase.id] = inputColums;
        }
        setColumns(actionTaskColumns);
      });
    }
  }, [data]);

  const handleContentComponent = item => {
    return (
      <div>
        <AdvanceDataTable
          data={item.actionTasks}
          columns={columns[item.id]}
          noDataLabel="Action Task not found"
        />
      </div>
    );
  };
  return (
    <div id="Step-5" className="row mt-5">
      <div className="col-12 col-border-title">
        {/* language switcher */}
        <LanguageSwitcher
          className="design-form-language-switcher"
          onClick={handleLanguageSwitch}
          activeLanguage={activeLanguage}
          languages={languages}
        />
        <div className="accordion-container mt-3">
          {/* Accordion */}
          {data.map(item => {
            return item.isMandatory ? (
              <Accordion
                key={item.refId}
                headerComponent={
                  <Header
                    phase={item.name}
                    isPrerequistes={item.isPrerequistes}
                    handlePrequisitePopup={() => {
                      handlePrequisitePopup(item);
                    }}
                  />
                }
                isPrerequistes={item.isPrerequistes}
                isContent={
                  item.actionTasks ? item.actionTasks.length > 0 : false
                }
                contentComponent={handleContentComponent(item)}
              />
            ) : // </div>
            null;
          })}
        </div>
      </div>
      <Popup
        scrollType="body"
        open={popupOpen}
        setClose={() => {
          setPopupOpen(false);
          setDataOpen(false);
          const newData = [...steps];
          newData[4].preview = [];
          changeStep(newData);
        }}
      >
        <PreviewUnit
          dataList={dataOpen ? getPopupData : []}
          handleClosePopup={handleClosePopup}
          toggleAccordion={toggleAccordion}
          preview={steps[4].preview}
          languages={languages}
          handleLanguageSwitch={handleLanguageSwitch}
          activeLanguage={activeLanguage}
        />
      </Popup>
    </div>
  );
}
Step5.defaultProps = {
  steps: [],
  getPopupData: [],
};
Step5.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  handleLanguageSwitch: PropTypes.func.isRequired,
  activeLanguage: PropTypes.instanceOf(Array).isRequired,
  languages: PropTypes.string.isRequired,
  callApiPreRequisites: PropTypes.isRequired,
  changeStep: PropTypes.func.isRequired,
  steps: PropTypes.instanceOf(Array),
  getPopupData: PropTypes.instanceOf(Array),
};
const mapStateToProps = state => ({
  steps: getSteps(state),
  getPopupData: getPopupDataSelector(state),
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      callApiPreRequisites: callApiPreRequisitesAction,
      changeStep: setWizardSteps,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(Step5);
