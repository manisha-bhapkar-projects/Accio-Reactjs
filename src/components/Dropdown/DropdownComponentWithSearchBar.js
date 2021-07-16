import React, { useState, useEffect } from 'react';
import { Dropdown, FormControl } from 'react-bootstrap';
import './DropdownComponentWithSearchBar.scss';
import PropTypes from 'prop-types';

const CustomMenu = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ children, style, className, 'aria-labelledby': labeledBy, show }, ref) => {
    const [value, setValue] = useState('');

    useEffect(() => {
      if (!show) {
        setValue('');
      }
    }, [show]);
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <div style={{ position: 'sticky' }}>
          <FormControl
            autoFocus
            id="search-box-dropdown"
            className="search-box"
            placeholder="Search" // &#xf0e0;
            onChange={e => setValue(e.target.value)}
            value={value}
            autoComplete="off"
          />
        </div>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value ||
              child.props.children.toLowerCase().includes(value.toLowerCase()),
          )}
        </ul>
      </div>
    );
  },
);

function DropdownComponentWithSearchBar({
  data,
  label,
  value,
  drop,
  error,
  className,
  labelClassName,
  filterDropdown,
  noOptionsMessage,
  isDisabled,
  ...rest
}) {
  return (
    <div
      className={`dropdown-component-with-search-bar ${className} ${
        filterDropdown ? 'filter' : ''
      }`}
    >
      {label ? (
        <label
          htmlFor={label}
          className={
            !error
              ? `input-label ${labelClassName} ${
                  filterDropdown ? 'filter' : ''
                }`
              : `input-label lable-error ${labelClassName} ${
                  filterDropdown ? 'filter' : ''
                }`
          }
        >
          {label}
        </label>
      ) : (
        ''
      )}
      <Dropdown
        drop={drop}
        className="custom-dropdown"
        focusFirstItemOnShow
        {...rest}
      >
        <Dropdown.Toggle
          id="dropdown-custom-components"
          className={
            !error
              ? `custom-dropdown-dispaly ${filterDropdown ? 'filter' : ''}`
              : `custom-dropdown-dispaly dropdown-error ${
                  filterDropdown ? 'filter' : ''
                }`
          }
          variant="link"
          disabled={isDisabled}
        >
          {value === '' || !data.find(item => item.value === value)
            ? 'Select'
            : value}
        </Dropdown.Toggle>

        <Dropdown.Menu
          as={CustomMenu}
          flip={false}
          className={`custom-dropdown-list ${filterDropdown ? 'filter' : ''}`}
        >
          {data.length === 0 ? (
            <Dropdown.Item disabled className="no-option-message">
              {noOptionsMessage}
            </Dropdown.Item>
          ) : (
            data.map(x => {
              return (
                <Dropdown.Item
                  key={x.id}
                  eventKey={x.id}
                  className={`custom-dropdown-items  ${
                    filterDropdown ? 'filter' : ''
                  }`}
                  active={x.value === value}
                >
                  {x.value}
                </Dropdown.Item>
              );
            })
          )}
        </Dropdown.Menu>
      </Dropdown>
      {error ? (
        <label htmlFor={error} className="input-error">
          {error}
        </label>
      ) : (
        ''
      )}
    </div>
  );
}

DropdownComponentWithSearchBar.defaultProps = {
  label: '',
  value: '',
  drop: 'down',
  filterDropdown: false,
  className: '',
  labelClassName: '',
  noOptionsMessage: '',
  error: '',
  isDisabled: false,
};
DropdownComponentWithSearchBar.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  drop: PropTypes.oneOf(['up', 'left', 'right', 'down']),
  filterDropdown: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  noOptionsMessage: PropTypes.string,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
};

CustomMenu.defaultProps = {
  style: {
    position: 'relative !important;',
    bottom: 'auto !important',
    transform: 'none !important',
  },
  className: '',
  // labeledBy: '',
};
CustomMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  // labeledBy: PropTypes.string,
};
export default DropdownComponentWithSearchBar;
