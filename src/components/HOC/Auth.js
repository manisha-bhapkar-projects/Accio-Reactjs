import React from 'react';
// import LayoutWithSidebar from '../Layout/WithSidebar/LayoutWithSidebar';
import getMessageAsPerLanguage from '../../utils/Messages';
import languages from '../../utils/DemoData/languages';

const Auth = ComposedComponent =>
  class extends React.Component {
    state = {
      primaryLanguageCode: 'en',
      globalMessages: getMessageAsPerLanguage('en'),
      languages,
    };

    render() {
      return (
        // <LayoutWithSidebar>
        <ComposedComponent {...this.props} {...this.state} />
        // </LayoutWithSidebar>
      );
    }
  };

export default Auth;
