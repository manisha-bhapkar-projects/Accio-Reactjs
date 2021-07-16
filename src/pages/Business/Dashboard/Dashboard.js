import React from 'react';
import Layout from '../../../components/Layout/Layout';
import CaseListing from '../CaseListing/CaseListing';

function Dashboard(props) {
  return (
    <div className="dashboard">
      <Layout>
        <CaseListing {...props} />
      </Layout>
    </div>
  );
}

export default Dashboard;
