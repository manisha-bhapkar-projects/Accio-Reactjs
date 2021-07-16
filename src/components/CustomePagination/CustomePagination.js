import React, { useState, useEffect } from 'react';
import './CustomePagination.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import labels from '../../utils/Locales/labels';
import Arrow from '../../images/Pagination/Arrow.png';

function CustomePagination({ totalLength, onPageChangedCalled }) {
  const [pageNo, setPageNo] = useState(1);
  const countTotalPage = totalLength / labels.WORKFLOWS.LIST.PAGINATION_LIMIT;
  // countTotalPage -= (totalLength % labels.WORKFLOWS.LIST.PAGINATION_LIMIT) / 10;
  // countTotalPage += totalLength % labels.WORKFLOWS.LIST.PAGINATION_LIMIT;
  // eslint-disable-next-line radix
  useEffect(() => {
    // if (searchtext) {
    setPageNo(1);
    // }
  }, [totalLength]);
  const TotalPages = Math.ceil(countTotalPage);
  const NextPage = () => {
    if (TotalPages !== pageNo) {
      window.scrollTo(0, 0);
      const page = pageNo + 1;
      setPageNo(page);
      onPageChangedCalled(page);
    }
  };
  const PreviousPage = () => {
    if (pageNo !== 1) {
      window.scrollTo(0, 0);
      const page = pageNo - 1;
      setPageNo(page);
      onPageChangedCalled(page);
    }
  };

  const getPageNumbers = totalPages => {
    const arr = [];
    for (let i = 1; i <= totalPages; i += 1) {
      arr.push(i);
    }
    return arr;
  };
  const selectPageNumber = _pageNo => {
    window.scrollTo(0, 0);
    setPageNo(_pageNo);
    onPageChangedCalled(_pageNo);
  };
  return (
    <div className="custome-pagination">
      <div
        className="pagination-arrow"
        onKeyDown={NextPage}
        onClick={NextPage}
        tabIndex="0"
        role="button"
      >
        <img
          alt="right"
          className={
            TotalPages !== pageNo ? 'right-arrow' : 'right-arrow opacity-5'
          }
          src={Arrow}
        />
      </div>
      {_.reverse(getPageNumbers(TotalPages)).map(_page => {
        // if (TotalPages <= 4 && _page <= Number(TotalPages / 2)) {
        //   if (_page === pageNo) {
        //     return <div className="pagination-number-selected">{_page}</div>;
        //   }
        //   return <div className="pagination-number">{_page}</div>;
        // }
        // if (pageNo !== 1 && _page < 3) {
        //   if (_page < 3) {
        //     if (_page === pageNo) {
        //       return <div className="pagination-number-selected">{_page}</div>;
        //     }
        //     return (
        //       <div
        //         className="pagination-number"
        //         onClick={() => {
        //           selectPageNumber(_page);
        //         }}
        //         onKeyDown={() => {
        //           selectPageNumber(_page);
        //         }}
        //         tabIndex="0"
        //         role="button"
        //       >
        //         {_page}
        //       </div>
        //     );
        //   }
        //   if (_page < pageNo && _page >= pageNo - 3) {
        //     return <div className="pagination-dot pr-2">.</div>;
        //   }
        // }
        if (
          (_page >= pageNo - 1 && _page <= pageNo + 1) ||
          _page === TotalPages ||
          _page === 1
        ) {
          if (_page === pageNo) {
            return <div className="pagination-number-selected">{_page}</div>;
          }
          return (
            <div
              className="pagination-number"
              onClick={() => {
                selectPageNumber(_page);
              }}
              onKeyDown={() => {
                selectPageNumber(_page);
              }}
              tabIndex="0"
              role="button"
            >
              {_page}
            </div>
          );
        }
        if (_page > pageNo - 4 && _page < pageNo + 4) {
          return <div className="pagination-dot">.</div>;
        }
        return <></>;
      })}
      <div
        className="pagination-arrow"
        onKeyDown={PreviousPage}
        onClick={PreviousPage}
        tabIndex="0"
        role="button"
      >
        <img
          alt="left"
          className={pageNo !== 1 ? 'left-arrow' : 'left-arrow opacity-5'}
          src={Arrow}
        />
      </div>
    </div>
  );
}

CustomePagination.propTypes = {
  totalLength: PropTypes.number.isRequired,
  onPageChangedCalled: PropTypes.func.isRequired,
  // searchtext: PropTypes.string.isRequired,
};
const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(CustomePagination);
