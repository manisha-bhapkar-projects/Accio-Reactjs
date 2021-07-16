import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Checkbox from '../../../components/Checkbox/Checkbox';
import CardListTable from '../../../components/CardListTable/CardListTable';
import { handleApiError } from '../../../utils/utils';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
// Redux
import { getPRDetailsAPIAction } from '../../../actions/prerequisiteListing';
import labelText from '../../../utils/Locales/labels';

function PrerequisiteDetails({ data, getPRDetailsApi, lang }) {
  // const [isLoaded, setIsLoaded] = React.useState(false);

  const [columns, setColumns] = React.useState([]);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [
    preRequisiteFieldDetails,
    setPreRequisiteFieldDetails,
  ] = React.useState([]);

  const initializeDetailsColumns = () => {
    const inputColumn = [
      {
        keyField: 'seq',
        name: labelText.PREREQUISITE.PREREQUISITE_DETAILS.COL_1,
        selector: 'field',
        sortable: false,
      },
    ];

    lang.forEach(locale => {
      inputColumn.push({
        keyField: 'seq',
        name: `${labelText.PREREQUISITE.PREREQUISITE_DETAILS.COL_LANG_LABEL} (${locale.languageName})`,
        sortable: false,
        cell: row => {
          return (
            <>
              {row.labelNames.length > 0
                ? row.labelNames.find(
                    item => item.languageCode === locale.languageCode,
                  ).name
                : ''}
            </>
          );
        },
      });
    });
    inputColumn.push({
      keyField: 'seq',
      name: labelText.PREREQUISITE.PREREQUISITE_DETAILS.COL_MANDATORY,
      sortable: false,
      cell: row => {
        return (
          <Checkbox
            id={`${row.field}`}
            defaultChecked={row.isMandatory}
            disabled
          />
        );
      },

      center: 'true',
    });
    setColumns(inputColumn);
  };
  const insertEmptyObjectsIn = arr => {
    if (arr.length === lang.length) {
      return arr;
    }
    lang.forEach(locale => {
      if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
        arr.push({
          name: '',
          languageCode: locale.languageCode,
        });
    });
    return arr;
  };

  useEffect(() => {
    initializeDetailsColumns();
  }, []);

  useEffect(() => {
    getPRDetailsApi(data.id)
      .then(res => {
        const PRDetails = res.data.data[0].preRequisites[0];

        const PRFieldDetails = PRDetails.details;
        PRFieldDetails.map(prerequisiteField => {
          const prerequisiteFieldLabels = prerequisiteField.labelNames;
          const modifiedPrerequisiteFieldLabels = insertEmptyObjectsIn(
            prerequisiteFieldLabels,
          );
          return modifiedPrerequisiteFieldLabels;
        });
        setPreRequisiteFieldDetails(PRFieldDetails);
      })
      .catch(err => {
        if (err) {
          const errMesage = handleApiError(err);
          setIsErrorMessage(true);
          setErrorMessage(errMesage);
        }
      });
  }, []);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);

  // useEffect(() => {
  //   if (preRequisiteFieldDetails.length > 0) {
  //     setIsLoaded(true);
  //   }
  // }, [preRequisiteFieldDetails]);

  // useEffect(() => {
  //   if (isLoaded) {
  //     initializeDetailsColumns();
  //   }
  // }, [isLoaded]);

  return (
    <div>
      <CardListTable
        data={_.cloneDeep(preRequisiteFieldDetails)}
        columns={columns}
        defaultSortField="seq"
        pending={!preRequisiteFieldDetails.length > 0}
      />
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />
    </div>
  );
}
PrerequisiteDetails.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  getPRDetailsApi: PropTypes.func.isRequired,
  lang: PropTypes.instanceOf(Array).isRequired,
};

const mapStateToProps = state => {
  return {
    lang: state.common.userLanguages,
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPRDetailsApi: getPRDetailsAPIAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrerequisiteDetails);
