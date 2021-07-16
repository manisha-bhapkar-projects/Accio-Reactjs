import { createSelector } from 'reselect';
import { fieldSorter } from '../../utils/utils';

// Add Or Update Phases
export const getPhasesFromState = state => state.phasesList.phases;
export const getPhasesForCancelFromState = state =>
  state.phasesList.dataForCancel;
export const getPhasesIsLoadingFromState = state => state.phasesList.isLoading;
export const getPhasesIsErrorFromState = state => state.phasesList.isError;
export const getPhasesIsSavedFromState = state => state.phasesList.isSaved;
export const getPhasesMessageFromState = state => state.phasesList.message;
export const getPhasesIsLoadingForSaveFromState = state =>
  state.phasesList.isLoadingForSave;

export const getPhasesListInSequence = createSelector(
  [getPhasesFromState],
  phasesList => {
    return phasesList.sort(fieldSorter(['phaseSequence']));
  },
);

export const getPhasesFListForCancelInSequence = createSelector(
  [getPhasesForCancelFromState],
  data => {
    // sorted data based on phaseSequence
    return data.sort(fieldSorter(['phaseSequence']));
  },
);
