// import React from "react";
import styled from 'styled-components';
import {
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

import calendarDefault from '../../../../images/calender/calendar-icon_inactive.png';
import calendarIcon from '../../../../images/calender/calendar-icon.png';

export const DatePickerContainer = styled.div`
  position: relative;
  display: flex;
  :focus {
    outline: none;
  }
`;

export const DatePickerFormGroup = styled(FormGroup)`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  border: 1px solid #00467f;
  border-radius: 5px;
  overflow: hidden;
`;

export const DatePickerLabel = styled(Label)`
  margin: 0;
  padding: 0 2rem;
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #06c;
  border-right: 2px solid #06c;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 102, 204, 0.05);
`;

export const DatePickerInput = styled(Input)`
  // padding: 1rem 2rem;
  font-weight: 500;
  color: #00467f;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 16px;
  text-align: left;
  box-shadow: none;
  border: none;
  background-color: transparent !important;
  background: url(${calendarDefault});
  background-position: right 15px center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  appearance: textfield;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  ::placeholder {
    color: #999;
    font-size: 0.9rem;
  }

  :hover {
    background: url(${calendarIcon});
    background-position: right 15px center;
    background-repeat: no-repeat;
  }
  :focus {
    background: url(${calendarIcon});
    background-position: right 15px center;
    background-repeat: no-repeat;
  }
`;

export const DatePickerDropdown = styled(Dropdown)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  :focus {
    outline: none;
  }
`;

export const DatePickerDropdownToggle = styled(DropdownToggle)`
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  opacity: 0;
  filter: alpha(opacity=0);
  :focus {
    outline: none;
  }
`;

export const DatePickerDropdownMenu = styled(DropdownMenu)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: none;
  padding: 0;
  margin: 0;
  transform: none !important;
  :focus {
    outline: none;
  }
`;
