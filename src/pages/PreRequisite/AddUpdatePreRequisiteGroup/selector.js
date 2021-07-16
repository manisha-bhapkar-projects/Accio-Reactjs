import { createSelector } from 'reselect';

export const getAddedPrerequisite = state =>
  state.prerequisiteGroupList.addedPrerequisite;

export const getAddedPrerequisiteIds = createSelector(
  [getAddedPrerequisite],
  prerequsite => {
    return prerequsite.map(element => {
      return {
        refId: element.id,
      };
    });
  },
);
