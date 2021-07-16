import { createSelector } from 'reselect';

export const getLanguages = state => state.common.userLanguages;
export const getWorkFlows = state => state.workFlows.list;
export const getAddUpdateMileStone = state => state.kickoff.addUpdateMilesones;
export const getWorkflowListSelector = state =>
  state.kickoff.addUpdateMilesones.select_workflow_List.map(x => {
    const item = {
      id: x.id,
      refId: x.refId,
      value: x.workflowName,
    };
    return item;
  });
export const getWorkflowListTableSelector = state =>
  state.kickoff.addUpdateMilesones.phase_Listing_Table;

export const getWorkFlowList = createSelector([getWorkFlows], workFlows => {
  return workFlows.map((workflow, index) => {
    // console.log(workFlows);
    return {
      id: index + 1,
      // workflowId: workflow.Id,
      editor: workflow.editor,
      propertyWorkflowId: workflow.refId,
      workflow: workflow.name,
      fitout: workflow.caseType,
      // updated_on: getFormatedDate(workflow.updatedAt),
      updated_on: workflow.updatedAt,
      update_by: workflow.editor.name,
      engagedToCase: workflow.engagedToCase,
    };
  });
});
