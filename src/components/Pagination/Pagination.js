import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.scss';
import paginationArrow from '../../images/arrow/black/SelectDropDownArrow/arrow-down-1.png';

const propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
};

const defaultProps = {
  initialPage: 1,
  pageSize: 10,
};

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentDidMount() {
    const { items, initialPage } = this.props;
    // set page if items array isn't empty
    if (items && items.length) {
      this.setPage(initialPage);
    }
  }

  componentDidUpdate(prevProps) {
    const { items, initialPage } = this.props;
    // reset page if items array has changed
    if (items !== prevProps.items) {
      this.setPage(initialPage);
    }
  }

  setPage(page) {
    const { items, pageSize, onChangePage } = this.props;
    let { pager } = this.state;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(items.length, page, pageSize);

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager });

    // call change page function in parent component
    onChangePage(pageOfItems);
  }

  getPager(totalItems, currentPageVar, pageSizeVar) {
    // default to first page
    const currentPage = currentPageVar || 1;

    // default page size is 10
    const pageSize = pageSizeVar || 10;

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage;
    let endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    }
    // more than 10 total pages so calculate start and end pages
    else if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      i => startPage + i,
    );

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  }

  render() {
    const { pager } = this.state;

    if (!pager.pages || pager.pages.length < 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <ul className="pagination">
        {/* <li className={pager.currentPage === 1 ? 'disabled' : ''}>
          <a onClick={() => this.setPage(1)}>First</a>
        </li> */}
        <li
          className={
            pager.currentPage === 1 ? 'page-item disabled' : 'page-item'
          }
        >
          <button
            type="button"
            className={
              pager.currentPage === 1 ? 'page-item disabled' : 'page-item'
            }
            onClick={() => this.setPage(pager.currentPage - 1)}
          >
            <img src={paginationArrow} className="arrow-left" alt="&lt;" />
          </button>
        </li>
        {pager.pages.map(page => (
          <li
            key={page}
            className={
              pager.currentPage === page ? 'page-item active' : 'page-item'
            }
          >
            <button
              type="button"
              className={
                pager.currentPage === page ? 'page-item active' : 'page-item'
              }
              onClick={() => this.setPage(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li
          className={
            pager.currentPage === pager.totalPages
              ? ' page-item disabled'
              : 'page-item'
          }
        >
          <button
            type="button"
            className={
              pager.currentPage === pager.totalPages
                ? ' page-item disabled'
                : 'page-item'
            }
            onClick={() => this.setPage(pager.currentPage + 1)}
          >
            <img src={paginationArrow} className="arrow-right" alt="&gt;" />
          </button>
        </li>
        {/* <li
          className={pager.currentPage === pager.totalPages ? 'disabled' : ''}
        >
          <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
        </li> */}
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;
