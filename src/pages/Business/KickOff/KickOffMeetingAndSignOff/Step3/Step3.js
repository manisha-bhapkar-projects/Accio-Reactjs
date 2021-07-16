/**
 * Step3 :
 *  add notes / comments using editor
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Editor from '../../../../../components/CKEditor/Editor';

import './Step3.scss';
import { countCharacter, scrollToTop } from '../../../../../utils/utils';

const Step3 = ({ notes, changeNotes }) => {
  const { t } = useTranslation();
  // scroll page to the top
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="add-notes-and-comments-screen">
      <Editor
        name="note-editor"
        labelClassName="note-label"
        label={t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_3.NOTES_LABEL')}
        content={notes}
        setContent={data => changeNotes(data)}
        tabIndex={-1}
        lengthOfContent={t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_3.LENGTH_OF_NOTES',
        )}
        isError={
          countCharacter(notes) >
          t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_3.LENGTH_OF_NOTES')
        }
        helperText="Length exided"
      />
    </div>
  );
};

export default Step3;

Step3.defaultProps = {
  notes: '',
};

Step3.propTypes = {
  notes: PropTypes.string,
  changeNotes: PropTypes.func.isRequired,
};
