import React from 'react';
import PropTypes from 'prop-types';
import './DashboardCard.scss';
import { Link } from 'react-router-dom';

// DashboardCard: card with icon, title, and subtitle
const DashboardCard = props => {
  const { icon, title, subtitle, link } = props;
  return (
    <Link to={link}>
      <div className="dashboard-card">
        <div className="dashboard-card-icon">{icon}</div>
        <div className="dashboard-card-title">{title}</div>
        <div className="dashboard-card-subtitle">{subtitle}</div>
      </div>
    </Link>
  );
};
export default DashboardCard;

DashboardCard.defaultProps = {
  icon: '',
  title: '',
  subtitle: '',
  link: '',
};

DashboardCard.propTypes = {
  icon: PropTypes.instanceOf(Object),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  link: PropTypes.string,
};
