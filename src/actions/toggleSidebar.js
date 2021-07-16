import { TOGGLE_SIDEBAR, COLLAPSE_SIDEBAR } from '../types';

export const toggleSidebar = (sidebarActive = 'sidebar-expanded') => ({
  type: TOGGLE_SIDEBAR,
  sidebarActive,
});

export const collapseSidebar = (sidebarActive = 'sidebar-expanded') => ({
  type: COLLAPSE_SIDEBAR,
  sidebarActive,
});
