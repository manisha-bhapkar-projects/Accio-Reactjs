/**
 * Step1 : RecordAttendees
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CardListTable from '../../../../../components/CardListTable/CardListTable';
import Checkbox from '../../../../../components/Checkbox/Checkbox';
import LabelWithIcon from '../../../../../components/LabelWithIcon/LabelWithIcon';
import './Step1.scss';
import TextFieldComponent from '../../../../../components/TextFieldComponent/TextFieldComponent';
import { validateEmail } from '../../../../../utils/validation';
import { scrollToTop } from '../../../../../utils/utils';

const Step1 = ({
  attendeesList,
  changeAttendees,
  countOfStep1DataUpdated,
  setcountOfStep1DataUpdated,
}) => {
  const { t } = useTranslation();

  const [columns, setColumns] = useState([]);

  const initializeColumns = () => {
    const columnsArray = [
      {
        name: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.COL_1'),
        grow: 2,
        selector: 'name',
        sortable: true,
        cell: rowData => {
          if (rowData.isTextBox) {
            return (
              // <input
              //   id={`name-${rowData.id}`}
              //   name={`name-${rowData.id}`}
              //   className="form-control"
              //   autoComplete="off"
              //   type="text"
              //   defaultValue={rowData.name}
              //   onChange={e => handleOnChange(e, rowData.id, 'name')}
              // />
              <TextFieldComponent
                id={`name-${rowData.id}`}
                name={`name-${rowData.id}`}
                type="text"
                inputClassName="form-control"
                autoComplete="off"
                helperText={rowData.nameErrorMessage}
                error={rowData.isNameError}
                defaultValue={rowData.name}
                onChange={e => handleOnChange(e, rowData.id, 'name')}
                // maxLength={
                //   formData.languageCode === primaryLanguage
                //     ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME
                //     : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME_SECODARY
                // }
                // autoFocus={formData.languageCode === primaryLanguage}
              />
            );
          }
          return <div>{rowData.name}</div>;
        },
      },
      {
        name: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.COL_2'),
        grow: 2,
        selector: 'company',
        sortable: true,
        cell: rowData => {
          if (rowData.isTextBox) {
            return (
              // <input
              //   id={`company-${rowData.id}`}
              //   name={`company-${rowData.id}`}
              //   className="form-control"
              //   autoComplete="off"
              //   defaultValue={rowData.company}
              //   onChange={e => handleOnChange(e, rowData.id, 'company')}
              // />
              <TextFieldComponent
                id={`company-${rowData.id}`}
                name={`company-${rowData.id}`}
                type="text"
                inputClassName="form-control"
                autoComplete="off"
                helperText={rowData.companyErrorMessage}
                error={rowData.isCompanyError}
                defaultValue={rowData.company}
                onChange={e => handleOnChange(e, rowData.id, 'company')}
                // maxLength={
                //   formData.languageCode === primaryLanguage
                //     ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME
                //     : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME_SECODARY
                // }
                // autoFocus={formData.languageCode === primaryLanguage}
              />
            );
          }
          return <div>{rowData.company}</div>;
        },
      },
      {
        name: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.COL_3'),
        grow: 2,
        selector: 'email',
        sortable: true,
        cell: rowData => {
          if (rowData.isTextBox) {
            return (
              // <input
              //   id={`email-${rowData.id}`}
              //   name={`email-${rowData.id}`}
              //   className="form-control"
              //   autoComplete="off"
              //   defaultValue={rowData.email}
              //   onChange={e => handleOnChange(e, rowData.id, 'email')}
              // />
              <TextFieldComponent
                id={`email-${rowData.id}`}
                name={`email-${rowData.id}`}
                type="text"
                inputClassName="form-control"
                autoComplete="off"
                helperText={rowData.emailErrorMessage}
                error={rowData.isEmailError}
                defaultValue={rowData.email}
                onChange={e => handleOnChange(e, rowData.id, 'email')}
                // maxLength={
                //   formData.languageCode === primaryLanguage
                //     ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME
                //     : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME_SECODARY
                // }
                // autoFocus={formData.languageCode === primaryLanguage}
              />
            );
          }
          return <div>{rowData.email}</div>;
        },
      },
      {
        name: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.COL_4'),
        grow: 2,
        selector: 'role',
        sortable: true,
        cell: rowData => {
          if (rowData.isTextBox) {
            return (
              // <input
              //   id={`role-${rowData.id}`}
              //   name={`role-${rowData.id}`}
              //   className="form-control"
              //   autoComplete="off"
              //   type="text"
              //   defaultValue={rowData.role}
              //   onChange={e => handleOnChange(e, rowData.id, 'role')}
              // />
              <TextFieldComponent
                id={`role-${rowData.id}`}
                name={`role-${rowData.id}`}
                type="text"
                inputClassName="form-control"
                autoComplete="off"
                helperText={rowData.roleErrorMessage}
                error={rowData.isRoleError}
                defaultValue={rowData.role}
                onChange={e => handleOnChange(e, rowData.id, 'role')}
                // maxLength={
                //   formData.languageCode === primaryLanguage
                //     ? labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME
                //     : labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1
                //         .LENGTH_OF_FORM_NAME_SECODARY
                // }
                // autoFocus={formData.languageCode === primaryLanguage}
              />
            );
          }
          return <div>{rowData.role}</div>;
        },
      },
      {
        name: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.COL_5'),
        grow: 1,
        cell: rowData => {
          return (
            <Checkbox
              defaultChecked={rowData.isPresent}
              onChange={() => handleOnChangeCheckBox(rowData.id)}
            />
          );
        },
      },
    ];
    setColumns(columnsArray);
  };

  // scroll page to the top
  useEffect(() => {
    scrollToTop();
    // const table = document.getElementById('card-list-table');
    // console.log('table width ============>', table.offsetWidth);
  }, []);

  useEffect(() => {
    initializeColumns();
  }, [countOfStep1DataUpdated]);

  // // on language change
  // i18next.on('languageChanged', () => {
  //   setcountOfStep1DataUpdated(countOfStep1DataUpdated + 1);
  // });

  // handleAddMoreFile: for add more attendees
  const handleAddMoreFile = () => {
    const listData = [...attendeesList];
    listData.push({
      id: listData.length + 1,
      name: '',
      isNameError: false,
      nameErrorMessage: '',
      company: '',
      isCompanyError: false,
      companyErrorMessage: '',
      email: '',
      isEmailError: false,
      emailErrorMessage: '',
      role: '',
      isRoleError: false,
      roleErrorMessage: '',
      isTextBox: true,
      isPresent: false,
    });
    changeAttendees(listData);
    setcountOfStep1DataUpdated(countOfStep1DataUpdated + 1);
  };

  // handleOnChange
  const handleOnChange = (e, id, valueOf) => {
    const listData = [...attendeesList];

    const indexOfItem = listData.findIndex(item => item.id === id);
    listData[indexOfItem][valueOf] = e.target.value;
    // validations of name,company name,email,role
    if (valueOf === 'name') {
      if (listData[indexOfItem][valueOf].length > 0) {
        listData[indexOfItem].isNameError = false;
        listData[indexOfItem].nameErrorMessage = '';
      }
    } else if (valueOf === 'email') {
      if (listData[indexOfItem][valueOf].length > 0) {
        listData[indexOfItem].isEmailError = false;
        listData[indexOfItem].emailErrorMessage = '';
        if (!validateEmail(listData[indexOfItem][valueOf])) {
          listData[indexOfItem].isEmailError = true;
          listData[indexOfItem].emailErrorMessage = 'Invalid Email';
        }
      } else {
        listData[indexOfItem].isEmailError = false;
        listData[indexOfItem].emailErrorMessage = '';
      }
    } else if (valueOf === 'company') {
      if (listData[indexOfItem][valueOf].length > 0) {
        listData[indexOfItem].isCompanyError = false;
        listData[indexOfItem].companyErrorMessage = '';
      }
    } else if (valueOf === 'role') {
      if (listData[indexOfItem][valueOf].length > 0) {
        listData[indexOfItem].isRoleError = false;
        listData[indexOfItem].roleErrorMessage = '';
      }
    }
    changeAttendees(listData);
  };

  // handleOnChangeCheckBox
  const handleOnChangeCheckBox = id => {
    const listData = [...attendeesList];
    const indexOfItem = listData.findIndex(item => item.id === id);
    listData[indexOfItem].isPresent = !listData[indexOfItem].isPresent;
    changeAttendees(listData);
  };

  return (
    <div className="record-attendees-screen">
      <CardListTable
        columns={columns}
        data={_.cloneDeep(attendeesList)}
        // numOfColumns={4}
        noDataString={t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.ATTENDEES_NOT_FOUND',
        )}
      />
      <LabelWithIcon
        className="add-more-button"
        label={t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_1.ADD_MORE_ROWS')}
        handleClick={handleAddMoreFile}
      />
    </div>
  );
};

export default Step1;

Step1.defaultProps = {
  attendeesList: [],
};

Step1.propTypes = {
  attendeesList: PropTypes.instanceOf(Array),
  changeAttendees: PropTypes.func.isRequired,
  countOfStep1DataUpdated: PropTypes.number.isRequired,
  setcountOfStep1DataUpdated: PropTypes.func.isRequired,
};
