import { TOGGLE_SIDEBAR, COLLAPSE_SIDEBAR } from '../types';

export default function common(
  sidebarActive = 'sidebar-expanded',
  action = {},
) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return sidebarActive === 'sidebar-expanded'
        ? 'sidebar-collapsed'
        : 'sidebar-expanded';
    case COLLAPSE_SIDEBAR:
      return 'sidebar-expanded';
    default:
      return sidebarActive;
  }
}
