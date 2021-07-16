import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import DataTable from 'react-data-table-component';
// import orderBy from 'lodash/orderBy';
import './CardListTable.scss';
import CustomePagination from '../CustomePagination/CustomePagination';

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
  // colorPrimary: {
  //   backgroundColor: '#e2e6f2',
  // },
  colorPrimary: {
    backgroundColor: '#c19d29',
  },
  barColorPrimary: {
    backgroundColor: '#ffffff',
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
 * @property{number} numOfColumns(defining how many columns to consider in table, if last columns has action button)
 */

function CardListTable(props) {
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
    numOfColumns,
    persistTableHead,
    onPageChangedCalled,
    custompagination,
    // searchtext,
    ...rest
  } = props;

  const numberOfCol = () => {
    if (numOfColumns === 0) {
      return columns.length;
    }
    return numOfColumns;
  };

  return (
    <div
      className={
        numberOfCol() > 4
          ? 'card-list-table'
          : 'card-list-table col-less-equal-4'
      }
    >
      {total && !pending ? (
        <div className="total">
          Total # <span> {data ? totalListCount : ''}</span>
        </div>
      ) : null}
      <DataTable
        columns={columns}
        data={data}
        className={total && !pending ? '' : 'margin-top-50'}
        noHeader
        highlightOnHover
        noDataComponent={
          <div className="no-data-component">{noDataString}</div>
        }
        // pointerOnHover
        customStyles={customStyles}
        // Progress
        progressPending={pending}
        progressComponent={<LinearIndeterminate />}
        persistTableHead={persistTableHead}
        // Pagination
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={totalListCount}
        paginationDefaultPage={1}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        onChangePage={handlePageChange}
        // overflowY
        {...rest}
      />

      {custompagination && !pagination && data && data.length ? (
        <CustomePagination
          totalLength={totalListCount}
          onPageChangedCalled={onPageChangedCalled}
          // searchtext={searchtext}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

CardListTable.defaultProps = {
  total: false,
  noDataString: 'No Records Available',
  pagination: false,
  custompagination: false,
  pending: false,
  paginationServer: false,
  totalListCount: 0,
  numOfColumns: 0,
  handlePageChange: () => {},
  persistTableHead: true,
  // searchtext: '',
};
CardListTable.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  columns: PropTypes.instanceOf(Array).isRequired,
  total: PropTypes.bool,
  pagination: PropTypes.bool,
  custompagination: PropTypes.bool,
  noDataString: PropTypes.string,
  pending: PropTypes.bool,
  paginationServer: PropTypes.bool,
  totalListCount: PropTypes.number,
  handlePageChange: PropTypes.func,
  numOfColumns: PropTypes.number,
  persistTableHead: PropTypes.bool,
  onPageChangedCalled: PropTypes.func.isRequired,
  // searchtext: PropTypes.string,
};

export default CardListTable;
