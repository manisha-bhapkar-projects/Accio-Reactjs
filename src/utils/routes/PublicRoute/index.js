import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isLogin } from '../../utils';

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  // console.log(isLogin(), restricted);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={props =>
        isLogin() && restricted ? (
          <Redirect to="/accio" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
PublicRoute.propTypes = {
  restricted: PropTypes.bool.isRequired,
};
export default PublicRoute;
