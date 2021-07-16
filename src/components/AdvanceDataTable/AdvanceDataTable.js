import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import './AdvanceDataTable.scss';

const AdvanceDataTable = props => {
  /**
   * data : data for data table
   * columns : columns of data table
   * noDataLabel: if no data found this component is shown
   * isPagination: we need paggination or not
   * isActionButtonsAtTheEnd: if we need action buttons at the end
   */
  const {
    data,
    columns,
    noDataLabel,
    isPagination,
    isActionButtonsAtTheEnd,
  } = props;

  const customStyles = {
    headCells: {
      style: {
        '&:last-child': {
          maxWidth: isActionButtonsAtTheEnd ? '100px !important' : '100%',
          marginRight: isActionButtonsAtTheEnd ? '20px' : '0px',
        },
      },
    },
  };
  
  return (
    <div className="advance-data-table">
      <DataTable
        title="Accio"
        columns={columns}
        data={data}
        noHeader
        pagination={isPagination}
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        noDataComponent={<div className="no-data-label">{noDataLabel}</div>}
      />
    </div>
  );
};

export default AdvanceDataTable;

AdvanceDataTable.defaultProps = {
  data: [],
  columns: [],
  noDataLabel: 'No data found.',
  isPagination: false,
  isActionButtonsAtTheEnd: false,
};

AdvanceDataTable.propTypes = {
  data: PropTypes.instanceOf(Array),
  columns: PropTypes.instanceOf(Array),
  noDataLabel: PropTypes.string,
  isPagination: PropTypes.bool,
  isActionButtonsAtTheEnd: PropTypes.bool,
};
