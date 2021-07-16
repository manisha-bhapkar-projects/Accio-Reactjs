import { createSelector } from 'reselect';

// export const getLanguages = state => state.common.userLanguages;
export const getSidebarDataSelector = state => state.sidebarData.sidebar;

export const getSidebarSelector = createSelector(
  [getSidebarDataSelector],
  sidebar => {
    // const sidebarData = [];
    // for (let i = 0; i < sidebar.length; i += 1) {
    // sidebarData.push(sidebar);
    // }
    // const item={...sidebar,}
    return sidebar;
  },
);
