import React, { useState } from 'react';
import PropTypes, { array } from 'prop-types';
import Select, { components } from 'react-select';
import './DropdownMultiSelect.scss';
import Checkbox from '../Checkbox/Checkbox';
import dropdownIcon from '../../images/arrow/black/SelectDropDownArrow/arrow-down-1.png';

const Menu = props => {
  const {
    children,
    selectProps: { multiSelectDesc },
  } = props;
  return (
    <div
      style={{
        borderRadius: '3px',
        marginTop: '0px',
        border: 'solid 1px #e0e0e1',
        backgroundColor: 'white',
        top: '100%',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '8px',
        position: 'absolute',
        width: '100%',
        zIndex: 1,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '40px',
          display: 'flex',
          width: '100%',
          paddingLeft: '16px',
          alignItems: 'center',
          color: '#595959',
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 'normal',
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: 'normal',
          letterSpacing: '0.98px',
          textTransform: 'uppercase',
        }}
      >
        {multiSelectDesc}
      </div>
      <components.Menu {...props}>{children}</components.Menu>
    </div>
  );
};

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Object),
    PropTypes.instanceOf(Array),
  ]).isRequired,
  selectProps: PropTypes.instanceOf(Object).isRequired,
};

function DropdownMultiSelect({
  data,
  labelName,
  labelClassName,
  className,
  multiSelectDesc,
  error,
  helperText,
  isSearchable,
  allowSelectAll,
  allOption,
  value,
  ...rest
}) {
  const [searchText, setSearchText] = useState('');
  const customStyles = {
    option: (provided, state) => ({
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: state.isSelected ? '500' : 'normal',
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: '1.5',
      // borderBottom: '1px solid #e2e6f2',
      letterSpacing: 'normal',
      color: '#3f3e45',
    }),
    menu: () => ({
      marginTop: '0px',
      position: 'relative',
      width: '100%',
      zIndex: 1,
    }),
  };

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={dropdownIcon} alt="" />
      </components.DropdownIndicator>
    );
  };

  const customOption = props => {
    const {
      isSelected,
      data: { label },
    } = props;
    return (
      <components.Option {...props}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            paddingLeft: '18px',
            alignItems: 'center',
          }}
        >
          <Checkbox checked={isSelected === true} />
          <div
            style={{
              borderBottom: '1px solid #e2e6f2',
              width: '100%',
              marginLeft: '2px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {' '}
            <span style={{ marginLeft: '10px' }}>{label}</span>
          </div>
        </div>
      </components.Option>
    );
  };

  customOption.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    data: PropTypes.instanceOf(Object).isRequired,
  };

  const MultiValueContainer = props => {
    const { selectProps } = props;

    const { label } = props.data;
    const allSelected = selectProps.value;
    const index = allSelected.findIndex(selected => selected.label === label);
    const count = allSelected.length;

    const isAllSelected = allowSelectAll
      ? data.length === allSelected.length - 1
      : data.length === allSelected.length;
    let val;
    if (isAllSelected) {
      val = index >= 1 ? '' : 'All';
    } else {
      val =
        index >= 1 ? '' : `${count} ${count === 1 ? 'item' : 'items'} selected`;
    }

    return val;
  };

  // MultiValueContainer.propTypes = {
  //   selectProps: PropTypes.instanceOf(Object),
  // };

  const IndicatorSeparator = ({ innerProps }) => {
    return <span style={{ display: 'none' }} {...innerProps} />;
  };

  IndicatorSeparator.propTypes = {
    innerProps: PropTypes.instanceOf(Object).isRequired,
  };

  const onInputChange = (query, { action }) => {
    // Prevents resetting our input after option has been selected
    if (action !== 'set-value') setSearchText(query);
  };

  return (
    <>
      <div className={`dropdown-multi-select ${className}`}>
        {labelName ? (
          <label
            htmlFor={labelName}
            className={`input-label ${labelClassName} ${
              error ? 'lable-error' : ''
            }`}
          >
            {labelName}
          </label>
        ) : (
          ''
        )}
        {allowSelectAll ? (
          <Select
            isMulti
            options={[allOption, ...data]}
            components={{
              Option: customOption,
              IndicatorSeparator,
              DropdownIndicator,
              Menu,
              MultiValueContainer,
            }}
            className="multi-select-dropdown"
            classNamePrefix={error ? 'multi-select-with-error' : 'multi-select'}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            value={value}
            styles={customStyles}
            isClearable={false}
            isSearchable={isSearchable}
            inputValue={searchText}
            onInputChange={onInputChange}
            placeholder="Select"
            multiSelectDesc={multiSelectDesc}
            blurInputOnSelect={false}
            {...rest}
            onChange={(selected, action) => {
              if (
                selected !== null &&
                selected.length > 0 &&
                selected[selected.length - 1].value === allOption.value &&
                action.action === 'select-option'
              ) {
                return rest.onChange([allOption, ...data]);
              }
              if (
                selected !== null &&
                selected.length > 0 &&
                action.option.value === allOption.value &&
                action.action === 'deselect-option'
              ) {
                return rest.onChange([]);
              }
              if (
                selected !== null &&
                selected.length > 0 &&
                action.option.value !== allOption.value &&
                action.action === 'deselect-option' &&
                selected.some(item => item.value === allOption.value)
              ) {
                const indexofAll = selected.findIndex(
                  item => item.value === allOption.value,
                );
                selected.splice(indexofAll, 1);
                return rest.onChange([...selected]);
              }

              if (
                selected !== null &&
                selected.length > 0 &&
                action.option.value !== allOption.value &&
                action.action === 'select-option' &&
                selected.length === data.length &&
                !selected.some(item => item.value === allOption.value)
              ) {
                return rest.onChange([allOption, ...selected]);
              }

              return rest.onChange(selected);
            }}
          />
        ) : (
          <Select
            isMulti
            options={data}
            components={{
              Option: customOption,
              IndicatorSeparator,
              DropdownIndicator,
              Menu,
              MultiValueContainer,
            }}
            multiSelectDesc={multiSelectDesc}
            // menuIsOpen
            className="multi-select-dropdown"
            classNamePrefix={error ? 'multi-select-with-error' : 'multi-select'}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            blurInputOnSelect={false}
            value={value}
            styles={customStyles}
            isClearable={false}
            isSearchable={isSearchable}
            inputValue={searchText}
            onInputChange={onInputChange}
            placeholder="Select"
            {...rest}
          />
        )}
        {helperText && error ? (
          <small className="helper-text">{helperText}</small>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

DropdownMultiSelect.defaultProps = {
  labelName: '',
  className: '',
  labelClassName: '',
  error: false,
  helperText: '',
  multiSelectDesc: 'Select',
  isSearchable: false,
  allowSelectAll: false,
  allOption: {
    id: 'all',
    value: 'All',
    label: ' Select All',
  },
  value: [],
};
DropdownMultiSelect.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  labelName: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  multiSelectDesc: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  isSearchable: PropTypes.bool,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.instanceOf(Object),
  selectProps: PropTypes.instanceOf(Object).isRequired,
  value: PropTypes.instanceOf(array),
};
export default DropdownMultiSelect;
