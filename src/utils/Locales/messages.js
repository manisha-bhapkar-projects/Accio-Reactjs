import labels from './labels';

export default {
  GLOBAL: {
    MANDATORY_FIELD: 'Please enter a value',
    MANDATORY_DROPDOWN_SELECT: 'Please select a option',
    AUTO_POPULATE_FIELDS:
      'Do you want to copy the values from English into the other languages?',
    ERR_TEXTFIELD_INPUT: 'Incorrect text format',
    ERR_EMAIL_INPUT: 'Please enter the email address in format: name@mail.com',
    SOMETHING_WENT_WRONG:
      'Something went wrong, we were unable to process your request, please refresh and try again. If the problem persists please contact our support team at accio-support@thinkhance.com',
    ERR_EXCEEDED_MAX_LENGTH: 'Max length exceeded',
    ERR_CHANGES_LOST:
      'Modified changes will be lost. Are you sure you want to cancel?',
    ERR_NO_SEARCH_RECORD: 'No Result Found for ',
  },
  LOGIN: {
    INVALID_USERNAME_PASSWORD: 'Username and/or password do not match',
    ERR_USERNAME_MANDATORY: 'Username is required',
    ERR_PASSWORD_MANDATORY: 'Password is required',
  },
  WORKFLOWS: {
    API_FAILURE:
      'Something went wrong, we were unable to process your request, please refresh and try again. If the problem persists please contact our support team at accio-support@thinkhance.com',
    AUTO_POPULATE_LANGUAGE:
      'Workflow name needs to be entered for all languages, do you want to copy the English workflow name into other languages?',
    LIST: {
      EMPTY_LIST: 'No workflows found',
      ENGAGED_CASE:
        'This workflow cannot be updated since it is in use in a case',
      PHASES_MORE_PREFILLED:
        'You have to Add Phases, Subphases at Property Level in Order to Create a New Workflow',
      WORKFLOWS_DELETE: 'Workflow deleted successfully',
    },
    STEP_1: {
      MANDATORY_FIELD: 'Workflow name is required',
      SELECT_ANY_ONE: 'Please select a fit-out type',
      DUPLICATE_NAME:
        'A workflow with the same name exists, specify another name',
      INVALID_FIELD:
        'Value must be 1-45 characters (A-Z, a-z, 0-9, and special characters like _(underscore), - (hyphen), ? (question mark), & (ampersand)',
      LENGTH: 'Length must be ', // ${labels.WORKFLOWS.STEP_1.LENGTH_OF_WORKFLOW_NAME}
    },
    STEP_2: {
      INVALID_FIELD:
        'Value must be 1-45 characters (A-Z, a-z, 0-9, and special characters like _(underscore), - (hyphen), ? (question mark), & (ampersand)',
      MANDATORY_FIELD: 'Day to complete is required',
      LENGTH_OF_SPECIFICATION: `length should be less then ${labels.WORKFLOWS.STEP_2.LENGTH_OF_DAYS}`,
      VALUE_MUSTBE_NUMBER: 'Value must be between 1 - 999',
    },
    STEP_3: {
      WARNING_SUBPHASE:
        'Did you know that you can disable the phase in step 2 instead of disabling all subphases here?',
    },
    STEP_4: {
      EMPTY_LIST: 'No pre-requisite available',
      DUPLICATE:
        'The pre-requisite group is already added before the same subphases. Please select another pre-requisite group or subphase',
      SELECT_ANY_ONE_PRE_GROUP: 'Please select a pre-requisite and a sub-phase',
      SELECT_ANY_ONE_BEFORE_PHASE:
        'Please select a pre-requisite and a sub-phase',
      CLICK_PREVIEW_POPUP_MSG:
        'Do you want to add the selected pre-requisite group and subphase? If yes please click on Add Pre-requisite group and then continue', // or Destroid
    },
    STEP_5: {
      SUCCESS_CREATE: 'Workflow created and published successfully',
      SUCCESS_EDIT: 'Workflow updated successfully',
    },
  },
  PHASES_AND_MORE: {
    ADD_OR_UPDATE_PHASES: {
      FIELD_IS_REQUIRED: 'Phase name is required',
      LABEL_SHOULD_BE_UNIQUE:
        'A phase with the same name exists, specify another name',
      PHASES_NOT_FOUND: 'Phases not found.',
      AUTO_POPULATE_LANGUAGE:
        'Phase name needs to be entered for all languages, do you want to copy the English phase name into other languages?',
      PHASE_NAME_SHOULD_BE_LESS: `Length should be less then ${labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.LENGTH_OF_PHASE_NAME}`,
      PHASE_NAME_SHOULD_BE_LESS_SECONDARY: `Length should be less then ${labels.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES.LENGTH_OF_PHASE_NAME_SECONDARY}`,
      DUPLICATE_PHASE: 'Duplicate phase name',
      PHASES_SAVED_SUCCESSFULLY: 'Phases saved successfully',
      PHASES_EDITED_SUCCESSFULLY: 'Phases updated successfully',
    },
    ADD_OR_UPDATE_SUB_PHASES: {
      FIELD_IS_REQUIRED: 'Subphase name is required',
      LABEL_SHOULD_BE_UNIQUE:
        'A subphase with the same name exists, specify another name',
      SUB_PHASES_NOT_FOUND: 'Subphases not found.',
      PHASES_LABEL_NOT_FOUND:
        'Phases need to be added before you add sub-phases.',
      AUTO_POPULATE_LANGUAGE:
        'Subphase name needs to be entered for all languages, do you want to copy the English subphase name into other languages?',
      SUB_PHASE_NAME_SHOULD_BE_LESS: `Length should be less then ${labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.LENGTH_OF_SUB_PHASE_NAME}`,
      SUB_PHASE_NAME_SHOULD_BE_LESS_SECONDARY: `Length should be less then ${labels.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES.LENGTH_OF_SUB_PHASE_NAME_SECONDARY}`,
      DUPLICATE_SUB_PHASE: 'Duplicate subphase name',
      SUB_PHASES_SAVED_SUCCESSFULLY: 'Subphases saved successfully',
      SUB_PHASES_EDITED_SUCCESSFULLY: 'Subphases updated successfully',
    },
  },
  PREREQUISITE_LIST: {
    PREREQUISITE_IN_GROUP_ERROR:
      'This pre-requisite cannot be deleted. Since it is used in existing pre-requisite group(s)',
    PREREQUISTE_WITH_CASE:
      'The pre-requisite cannot be edited since it is used in a pre-requisite group which is in use in a case',
    PREREQUISITE_DELETE_SUCCESSFULL: 'Pre-requisite deleted successfully',
    PREREQUISITE_LIST_NO_DATA: 'No pre-requisite available',
    LABEL_SHOULD_BE_UNIQUE:
      'This label is already in use in this pre-requisite, specify another label',
    DUPLICATE_FIELD_LABEL: 'Duplicate field label',
    DUPLICATE_NAME:
      'A pre-requisite with the same name exists, specify another name',
    ADD_PREREQUISITE_SUCCESS: 'Pre-requisite created successfully',
    EDIT_PREREQUISITE_SUCCESS: 'Pre-requisite updated successfully',
  },
  PREREQUISITE_GROUP_LIST: {
    PREREQUISITE_GROUP_LIST_NO_DATA: 'No pre-requisite group available',
    PREREQUISITE_GROUP_WITH_CASE:
      'You cannot edit this pre-requisite group as this pre-requisite group is associated with as case',
    PREREQUISITE_GROUP_NO_ADDED_PREREQUISITE: 'No pre-requisite available',
    PREREQUISITE_GROUP_NO_SELECTED_PREREQUISITE:
      'Please select a pre-requisite',
    NO_PRERQUISITE_ADDED_IN_GROUP:
      'At least one pre-requisite should be added in a pre-requisite group',
    DUPLICATE_NAME:
      'A pre-requisite group with the same name exists, specify another name',
    PREREQUISITE_GROUP_IN_WORKFLOW_ERROR:
      'This pre-requisite group cannot be deleted, since it is in use in an existing workflow ',
    PREREQUISITE_GROUP_DELETE_SUCCESSFULL:
      'Pre-requisite group deleted successfully',
    ADD_PREREQUISITE_GROUP_SUCCESS: 'Pre-requisite Group created successfully',
    EDIT_PREREQUISITE_GROUP_SUCCESS: 'Pre-requisite Group updated successfully',
    INFO_CHECKED_PREREQUISITE_NOT_SELECTED:
      'Do you want to add the selected pre-requisites? If yes please click on Select and continue',
  },
  DESIGN_FORMS: {
    DESIGN_FORMS_LISTING: {
      EMPTY_LIST: 'No Records Found',
      FORM_DELETED_MESSAGE: 'Form deleted successfully',
    },
    SETUP_DESIGN_FORM: {
      FORM_SAVED_SUCCESSFULLY: 'Form created and published successfully',
      FORM_EDITED_SUCCESSFULLY: 'Form updated successfully',
      STEP_1: {
        FORM_NAME_IS_REQUIRED: 'Form name is required',
        AUTO_POPULATE_LANGUAGE:
          'Form name needs to be entered for all languages, do you want to copy the English form name into other languages?',
        FIT_OUT_TYPE_IS_REQUIRED: 'Fitout type is required',
        DESIGN_SUBPHASE_IS_REQUIRED: 'Design sub-phase is required',
        FORM_NAME_SHOULD_BE_LESS: `Form name length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.LENGTH_OF_FORM_NAME}`,
        FORM_NAME_SHOULD_BE_LESS_SECONDARY: `Form name length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_1.LENGTH_OF_FORM_NAME_SECODARY}`,
        FIT_OUT_TYPE_NOT_FOUND: 'Fitout types not found',
        DESIGN_SUBPHASES_NOT_FOUND: 'No design subphases added',
      },
      STEP_2: {
        NOTE_IS_REQUIRED: 'Notes are required',
        SPECIFICATION_IS_REQUIRED: 'Specifications are required',
        AUTO_POPULATE_NOTE:
          'Notes needs to be entered for all languages, do you want to copy the English Notes into other languages?',
        AUTO_POPULATE_SPECIFICATION:
          'Specifications needs to be entered for all languages, do you want to copy the English Specifications into other languages?',
        AUTO_POPULATE_BOTH:
          'Notes and Specifications needs to be entered for all languages, do you want to copy the English Notes and Specifications into other languages?',
        DESIGN_SUBPHASE_IS_REQUIRED: 'Design sub-phase is required',
        ERROR_WHILE_STORING_NOTE_AND_SPECIFICATION:
          'There was an error while saving the data. please try again. If the problem persists please contact our support team at accio-support@thinkhance.com',
        LENGTH_OF_NOTE: `Content length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_NOTE_CONTENT}`,
        LENGTH_OF_NOTE_SECONDARY: `Content length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_NOTE_CONTENT_SECONDARY}`,
        LENGTH_OF_SPECIFICATION: `Content length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_SPECIFICATION_CONTENT}`,
        LENGTH_OF_SPECIFICATION_SECONDARY: `Content length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_2.LENGTH_OF_SPECIFICATION_CONTENT_SECONDARY}`,
      },
      STEP_3: {
        FIELD_IS_REQUIRED: 'Section name is required',
        LABEL_SHOULD_BE_UNIQUE:
          'The section name entered is used in this form, specify another name',
        ADD_SECTION_FIRST: 'No sections added',
        ERROR_WHILE_STORING_SECTION_NAME:
          'There was an error while saving the data. please try again. If the problem persists please contact our support team at accio-support@thinkhance.com',
        SECTION_NAME_SHOULD_BE_LESS: `Length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.LENGTH_OF_SECTION_NAME}`,
        SECTION_NAME_SHOULD_BE_LESS_SECONDARY: `Length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_3.LENGTH_OF_SECTION_NAME_SECONDARY}`,
        DUPLICATE_SECTION_NAME:
          'The section name already added in this form, specify another section name',
      },
      STEP_4: {
        FIELD_IS_REQUIRED: 'Filename is required',
        NO_FILES_FOUND: 'Files not found',
        LABEL_SHOULD_BE_UNIQUE:
          'The filename entered is already used in this form, specify another name',
        ERROR_WHILE_STORING_FILES:
          'There was an error while saving the data. please try again. If the problem persists please contact our support team at accio-support@thinkhance.com',
        FILE_NAME_SHOULD_BE_LESS: `Length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.LENGTH_OF_FILE_NAME}`,
        FILE_NAME_SHOULD_BE_LESS_SECONDARY: `Length should be less then ${labels.DESIGN_FORMS.SETUP_DESIGN_FORM.STEP_4.LENGTH_OF_FILE_NAME_SECONDARY}`,
        DUPLICATE_FILE_NAME: 'Duplicate file name',
        NO_FILE_TYPE_SELECTED: 'File type is required',
      },
      STEP_5: {
        ITEMS_TO_BE_SUBMITTED:
          'Max file size to be uploaded upto 10 MB per each file.',
      },
    },
  },
  USER_AND_ACCESS: {
    USER_LISTING: {
      USER_LIST_NO_DATA: 'No user added',
    },

    USER_ACCESS_SETUP: {
      ERR_SAME_ROW_DATA:
        'Same property is added twice, select a different property',
      ADD_USER_SUCCESS: 'User created successfully',
      EDIT_USER_SUCCESS: 'User updated successfully',
      CONFIRM_USER_TYPE_CHANGE:
        'Changing the assigned user type will cause deletion of all the data enter in further steps. \n Are you sure you want to continue',
    },
    STEP_2: {
      ERR_NO_PROPERTY_FOR_LLC:
        'The LLC you selected does not contain any property you have access to.',
      ERR_NO_ACCESS_ADDED:
        'Access is required, select access to be provided to the user for the property',
      ERR_NO_FULL_CASE_ACCESS: 'Please select a access type',
      ERR_ACCESS_ALREADY_ASSIGNED:
        'A similar or superior access is already assigned to the property you are providing access',
      CONFIRM_ASSIGNED_ACCESS_DELETE:
        'Removing access to this property, will revoke access for all customer, brands, departments and roles for the user for this property.\n Are you sure you want to remove this access?',
    },
    STEP_3: {
      ERR_SAME_ROW_DATA:
        'Same customer and brands are added twice, select different customer and brands',
      ERR_NO_BRNAD_FOR_BRNAD_TYPE:
        'No brands available for the brand type selected. Please select another brand types',
      ERR_NO_CUSTOMER_ASSIGNED:
        'Please select a customer or company the user belongs to, customer is required for a user of type tenant',
      ERR_UNIQUE_CUSTOMER:
        'A user of type tenant can be associated with one customer or company only',
      ALERT_SKIP_AND_CONTINUE: 'No changes made please skip and Continue',
      ALERT_SAVE_AND_CONTINUE: 'Save and Continue for the changes made',
      ERR_NOT_ALL_PROPERTY_ASSIGNED:
        'Please assign customer and brands for all the properties access assigned in previous step',
      ERR_OVERRIDING_ACCESS:
        'Same customer or brand access is already added for the same property, please check and correct the assignment',
      CONFIRM_ASSIGNED_CUSTOMER_BRAND_DELETE:
        'Are you sure you want to remove this customer and brand assigned?',
    },
    STEP_4: {
      ERR_NO_DEPT_AND_ROLE_ASSIGNED:
        'Department and role are required to complete the user access',
      ERR_DEPT_OR_ROLE_ALREDY_EXISTS:
        'Same department and roles are already assigned for the same property, please check and correct the assignment',
      ERR_NOT_ALL_PROPERTY_ASSIGNED:
        'Department and roles are required for every property the user has access to, please provide the same',
      CONFIRM_ASSIGNED_DEPT_ROLE_DELETE:
        'Are you sure you want to remove this department and role assigned?',
      ERR_SAME_ROW_DATA:
        'Same departments and roles are added twice, select different departments and roles',
    },
  },
  BUSINESS: {
    KICK_OFF: {
      ASSIGN_TEAM: {
        USERS_NOT_FOUND_FOR_SELECTED_ROLE:
          'Users not found for selected role please select another role',
        USER_EXIST_WITH_SAME_ROLE:
          'User with same role already exist,please select another user',
        USER_IS_REQUIRED: 'User is required',
        REQUIRED_USER_WITH_ROLE:
          'Member with this role is required.If you delete this member then you need to add new user with same role ',
        ADD_PRE_APPROVED_CONTRACTOR: {
          PRE_APPROVED_CONTRACTOR_LIST_NO_DATA:
            'No pre-approved contractors available ',
          PLEASE_SELECT_PRE_APPROVED_CONTRACTOR:
            'Please select pre-approved contractor',
        },
      },
      KICK_OFF_MEETING_AND_SIGNED_OFF: {
        KICK_OFF_SIGN_OFF: {
          SELECT_SIGNED_DOCUMENT: 'Select signed document',
          SELECT_VALID_DOCUMENT: 'Select valid signed document',
          ERROR_DOCUMENT_SIZE: 'Maximum 10 MB file allowed',
        },
      },
    },
  },
};
