import React from 'react';
import PropTypes from 'prop-types';
// import LayoutWithSidebar from '../Layout/WithSidebar/LayoutWithSidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const LanguageWrapper = ComposedComponent => {
  const WrapperComponent = ({ language, ...rest }) => {
    return <>{language.length > 0 && <ComposedComponent {...rest} />}</>;
  };

  const mapStateToProps = state => ({
    language: state.common.userLanguages,
  });

  const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
  WrapperComponent.propTypes = {
    language: PropTypes.instanceOf(Array).isRequired,
  };
  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
};

export default LanguageWrapper;
