import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import './SortAdvanceDataTable.scss';

const SortAdvanceDataTable = props => {
  const { data, columns, noDataLabel, isPagination } = props;
  return (
    <div
      className={
        columns.length < 4
          ? 'sord-advance-data-table'
          : 'sord-advance-data-table column-less4'
      }
    >
      <DataTable
        title="Accio"
        columns={columns}
        data={data}
        noHeader
        pagination={isPagination}
        highlightOnHover
        pointerOnHover
        noDataComponent={<div className="no-data-label">{noDataLabel}</div>}
      />
    </div>
  );
};

export default SortAdvanceDataTable;

SortAdvanceDataTable.defaultProps = {
  data: [],
  columns: [],
  noDataLabel: 'No data found.',
  isPagination: false,
};

SortAdvanceDataTable.propTypes = {
  data: PropTypes.instanceOf(Array),
  columns: PropTypes.instanceOf(Array),
  noDataLabel: PropTypes.string,
  isPagination: PropTypes.bool,
};
