import React from 'react';

function useExpandHook() {
  const [expanded, setExpanded] = React.useState('');

  const toggleExpansion = e => {
    e.preventDefault();
    setExpanded(expanded === '' ? 'expand' : '');
  };

  return [expanded, toggleExpansion];
}

export default useExpandHook;
