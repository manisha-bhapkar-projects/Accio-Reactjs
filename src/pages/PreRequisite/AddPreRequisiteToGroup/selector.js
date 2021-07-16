import { createSelector } from 'reselect';

export const getAllPrerequisites = state => state.prerequisiteList.list;

export const getAllPreRequisiteList = createSelector(
  [getAllPrerequisites],
  PRList => {
    return PRList.map(prereq => {
      return {
        id: prereq.id,
        prerequisite: prereq.prerequisite,
        isPrerequisiteSelected: false,
        isExpanded: false,
        isDisabled: false,
      };
    });
  },
);
