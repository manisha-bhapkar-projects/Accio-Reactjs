import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import DataTable from 'react-data-table-component';
import './FormDataTable.scss';

// PENDING CUSTOM COMPONENT STYLING

const customStyles = {
  headCells: {
    style: {
      fontSize: '15px',
      fontWeight: '900',
    },
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(0),
    },
  },
}));

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#c19d29',
  },
  barColorPrimary: {
    backgroundColor: '#fff',
  },
  root: {
    height: 2,
  },
})(LinearProgress);

const LinearIndeterminate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ColorLinearProgress />
    </div>
  );
};

/**
 * Pagination
 * @property{bool} progressPending
 * @property{bool} paginationServer (For Server Side Pagination)
 * @property{Object} paginationTotalRows (For eg : {10})  //prop used is totalListCount which we get as a api response
 * @property{Object} paginationDefaultPage (For eg : {1})
 * @property{Object} onChangePage Callback func
 * @property{Object} paginationComponentOptions {{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'All' }}
 */

/**
 * Pending
 * @property{bool} pagination
 * @property{JSX} progressComponent (Custom progressComponent)
 * @property{bool} persistTableHead
 */

function FormDataTable(props) {
  const {
    data,
    columns,
    total,
    noDataString,
    pending,
    pagination,
    paginationServer,
    totalListCount,
    handlePageChange,
    ...rest
  } = props;
  return (
    <div className="form-data-table">
      {total && !pending ? (
        <div className="total">
          Total # <span> {data ? totalListCount : ''}</span>
        </div>
      ) : null}
      <DataTable
        columns={columns}
        data={data}
        noHeader
        highlightOnHover
        noDataComponent={<div className="no-data-label">{noDataString}</div>}
        // pointerOnHover
        customStyles={customStyles}
        // Progress
        progressPending={pending}
        progressComponent={<LinearIndeterminate />}
        persistTableHead
        // Pagination
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={totalListCount}
        paginationDefaultPage={1}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        onChangePage={handlePageChange}
        {...rest}
      />
    </div>
  );
}

FormDataTable.defaultProps = {
  total: false,
  noDataString: 'No Records Available',
  pagination: false,
  pending: false,
  paginationServer: false,
  totalListCount: 0,
  handlePageChange: () => {},
};
FormDataTable.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  columns: PropTypes.instanceOf(Array).isRequired,
  total: PropTypes.bool,
  pagination: PropTypes.bool,
  noDataString: PropTypes.string,
  pending: PropTypes.bool,
  paginationServer: PropTypes.bool,
  totalListCount: PropTypes.number,
  handlePageChange: PropTypes.func,
};

export default FormDataTable;
