import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
// import _ from 'lodash';
// import DetailsItem from '../../../components/DetailsItem/DetailsItem';
import CardHeader from '../../../components/CardHeader/CardHeader';
import CardListTable from '../../../components/CardListTable/CardListTable';
import deleteIcon from '../../../images/delete/delete.png';
// import editIcon from '../../../images/edit/edit.png';
import './AssignCustomerAndBrand.scss';
import DropdownComponent from '../../../components/Dropdown/DropdownComponent';
import DropdownMultiSelect from '../../../components/Dropdown/DropdownMultiSelect';
import LabelWithIcon from '../../../components/LabelWithIcon/LabelWithIcon';
import { getErrorMessage, scrollToTop } from '../../../utils/utils';
import ErrorAlert from '../../../components/Alerts/AlertBox/ErrorAlert/ErrorAlert';
import InformationAlert from '../../../components/Alerts/AlertBox/InformationAlert/InformationAlert';
import labelText from '../../../utils/Locales/labels';
import displayMessages from '../../../utils/Locales/messages';

import {
  getUserAccessSteps,
  getAssignedCustomerWithAll,
  getBrandTypeListWithAll,
  // getBrandListWithAll,
  getAssignedCustomer,
  getUserIdFromState,
  getSelectedPropertyList,
} from '../selector';
import {
  setWizardStepsUserAccess,
  getCustomerListAPIAction,
  getBrandTypeListAPIAction,
  getBrandListAllAPIAction,
  getBrandListForIdAPIAction,
  getAssignedCustomerAPIAction,
  deleteCustomerAndBrandAssignedAPIAction,
  getSelectedPropertyListAPIAction,
  getAssignedAccessAPIAction,
  getCustomerListByPropertyAPIAction,
} from '../../../actions/userAndAccessAction';

function AssignCustomerAndBrand({
  stepData,
  changeStepData,
  selectedPropertyList,
  // customerList,
  // getCustomerListAPI,
  brandTypeList,
  getBrandTypeListAPI,
  // getBrandListAllAPI,
  // brandListAll,
  getAssignedAccessAPI,

  getBrandListForIdAPI,
  getAssignedCustomerAPI,
  getCustomerListByPropertyAPI,
  assignedCustomer,
  userId,
  deleteCustomerAndBrandAssignedAPI,
  isEditUserReq,
  isAllCustomerBrandAssigned,
  getSelectedPropertyListAPI,
}) {
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmDeletion, setConfirmDeletion] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState([]);

  // const compareCommonDataRow = arr => {
  //   for (let i = 0; i < arr.length - 1; i += 1) {
  //     for (let j = i + 1; j < arr.length; j += 1) {
  //       if (_.isEqual(arr[i], arr[j])) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // };

  // const checkIncorrectAssignment = () => {
  //   const tempStepData = [...stepData];

  //   if (
  //     tempStepData[2].addCustomerRows.some(item => item.hasAnyValue === true)
  //   ) {
  //     const rowsHavingValue = tempStepData[2].addCustomerRows.filter(
  //       item => item.hasAnyValue === true,
  //     );

  //     const duplicationCheckArray = [];

  //     const pickupArray = _.map(
  //       rowsHavingValue,
  //       _.partialRight(_.pick, ['property', 'customer', 'brand']),
  //     );
  //     // console.log(pickupArray, 'pickupArray');

  //     pickupArray.forEach(rowItem => {
  //       rowItem.brand.forEach(brandObj => {
  //         if (brandObj.id !== 'all') {
  //           const checkArrayObj = {
  //             property: rowItem.property,
  //             customer: rowItem.customer,
  //             brand: brandObj,
  //           };
  //           duplicationCheckArray.push(checkArrayObj);
  //         }
  //       });
  //     });

  //     if (compareCommonDataRow(duplicationCheckArray)) {
  //       setErrorMessage(
  //         displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
  //       );
  //       setIsErrorMessage(true);
  //     }

  // const modifiedRowsHavingValues = [...rowsHavingValue];
  // modifiedRowsHavingValues.map(item => {
  //   const modifiedItem = item;
  //   modifiedItem.combineCustProperty = `${modifiedItem.customer.id} ${modifiedItem.property.id}`;
  //   return modifiedItem;
  // });
  // const dataGroupByCutomer = _.groupBy(
  //   modifiedRowsHavingValues,
  //   'combineCustProperty',
  // );
  // console.log(dataGroupByCutomer, 'custsdfs');

  // const customerGroupArray = Object.keys(dataGroupByCutomer);

  // if (customerGroupArray.length > 0) {
  //   customerGroupArray.forEach(cust => {
  //     const oneCustGroup = dataGroupByCutomer[cust];
  //     if (oneCustGroup.length > 1) {
  //       if (oneCustGroup.some(item => item.brandType.id === 'all')) {
  //         setErrorMessage(
  //           displayMessages.USER_AND_ACCESS.STEP_3.ERR_OVERRIDING_ACCESS,
  //         );
  //         setIsErrorMessage(true);
  //       }
  //     }
  //   });
  // }
  //   }
  // };

  useEffect(() => {
    scrollToTop();
    // getCustomerListAPI();
    getBrandTypeListAPI();
    getAssignedAccessAPI(userId);
    getSelectedPropertyListAPI(userId);
    // getBrandListAllAPI();
    if (userId) {
      getAssignedCustomerAPI(userId);
    }
  }, []);

  useEffect(() => {
    if (
      stepData[0].userData.userType.value.toLowerCase() === 'owner' &&
      selectedPropertyList.length > 0 &&
      isEditUserReq
    ) {
      if (assignedCustomer.length === 0) {
        const tempStepData = [...stepData];
        tempStepData[2].isAllCustomerBrandAssigned = true;
        changeStepData(tempStepData);
      }
    }
  }, [assignedCustomer]);

  // useEffect(() => {
  //   checkIncorrectAssignment();
  //   // console.log('is getting called');
  // }, [stepData]);

  useEffect(() => {
    if (!isErrorMessage) {
      setErrorMessage('');
    }
  }, [isErrorMessage]);
  const customerAssignedColumns = [
    {
      selector: 'property',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
          .ASSIGNED_CUSTOMER.PROPERTY_COL_1,
      sortable: false,
    },
    {
      selector: 'customer',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
          .ASSIGNED_CUSTOMER.CUSTOMER_COL_2,
      sortable: false,
    },
    // {
    //   name: 'Brand Type',
    //   selector:
    //     labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
    //       .ASSIGNED_CUSTOMER.BRAND_TYPE_COL_3,
    //   sortable: false,
    // },
    {
      selector: 'brand',
      name:
        labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
          .ASSIGNED_CUSTOMER.BRAND_COL_4,
      sortable: false,
    },
    {
      name: '',
      sortable: false,
      cell: rowData => {
        return (
          <>
            {/* <button type="button" className="edit-button" onClick={() => {}}>
              <img src={editIcon} alt="edit" style={{ marginRight: '15px' }} />
            </button> */}
            <button
              type="button"
              className="delete-button"
              onClick={() => {
                handleDeleteAssignedCustomer(rowData);
              }}
            >
              <img
                src={deleteIcon}
                alt="del"
                style={{ height: '21px', width: '16px', marginRight: '15px' }}
              />
            </button>
          </>
        );
      },
      // grow: '1',
      width: '100px',
      right: true,
    },
  ];

  const handleDeleteAssignedCustomer = assignedCustomerRow => {
    // we will need to pass userId corresponding to which we are deleting

    if (!confirmDeletion) {
      setRowToDelete(assignedCustomerRow);
      setConfirmDeletion(true);
      return;
    }

    deleteCustomerAndBrandAssignedAPI(assignedCustomerRow.id)
      .then(res => {
        if (res.data.success) {
          setConfirmDeletion(false);
          getAssignedCustomerAPI(userId);
        }
      })
      .catch(err => {
        setConfirmDeletion(false);
        if (err) {
          const errMess = getErrorMessage(err);
          setIsErrorMessage(true);
          setErrorMessage(errMess);
        }
      });
  };

  const handlePropertySelect = (_eventKey, customerRowId) => {
    if (_eventKey === 'select') {
      const tempStepData = [...stepData];
      const indexToReset = tempStepData[2].addCustomerRows.findIndex(
        item => item.id === customerRowId,
      );
      const resetObj = {
        id: customerRowId,
        property: {},
        customer: { id: 'all', value: 'All' },
        brandType: { id: 'all', value: 'All' },
        brand: [{ id: 'all', value: 'All', label: 'All' }],
        brandListOnBrandType: [],
        customerDropDownData: [],
        hasAnyValue: false,
        customerError: '',
        propertyError: '',
        brandError: '',
        isDisabled: true,
        isBrandDisabled: true,
        isCustomerDisabled: true,
      };
      tempStepData[2].addCustomerRows.splice(indexToReset, 1, resetObj);
      changeStepData(tempStepData);
    } else {
      const selectedVal = selectedPropertyList.find(
        item => item.id === _eventKey,
      );
      const tempStepData = [...stepData];

      if (
        tempStepData[2].addCustomerRows.find(item => item.id === customerRowId)
          .property.id !== _eventKey
      ) {
        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).propertyError = '';

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).hasAnyValue = true;

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).customer = { id: 'all', value: 'All' };

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).brandType = { id: 'all', value: 'All' };

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).brandListOnBrandType = [];

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).brand = [{ id: 'all', value: 'All', label: 'All' }];

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).brandError = '';

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isDisabled = true;
        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isBrandDisabled = true;

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).property = selectedVal;

        getCustomerListByPropertyAPI(selectedVal.id)
          .then(res => {
            if (res.data.success) {
              const apiData = res.data.data;
              const customerByPropertyList = [];
              apiData.forEach(customer => {
                const custObj = {
                  id: customer.customerId,
                  value: customer.customerName,
                };
                customerByPropertyList.push(custObj);
              });

              customerByPropertyList.unshift({ id: 'all', value: 'All' });

              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).customerDropDownData = customerByPropertyList;
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).isCustomerDisabled = false;
              changeStepData(tempStepData);
            }
          })
          .catch(err => {
            if (err) {
              changeStepData(tempStepData);
            }
          });

        // changeStepData(tempStepData);
      }
    }
  };

  const handleCustomerSelect = (_eventKey, customerRowId) => {
    const tempStepData = [...stepData];
    const selectedVal = tempStepData[2].addCustomerRows
      .find(item => item.id === customerRowId)
      .customerDropDownData.find(item => item.id === _eventKey);

    if (
      tempStepData[2].addCustomerRows.find(item => item.id === customerRowId)
        .customer.id !== _eventKey
    ) {
      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).customerError = '';

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).hasAnyValue = true;

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).customer = selectedVal;

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).brandType = { id: 'all', value: 'All' };

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).brand = [{ id: 'all', value: 'All', label: 'All' }];

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).brandError = '';

      if (selectedVal.id !== 'all') {
        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isDisabled = false;

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isBrandDisabled = false;

        const customerId = selectedVal.id;
        let brandTypeId;
        if (
          tempStepData[2].addCustomerRows.find(
            item => item.id === customerRowId,
          ).brandType.id === 'all'
        ) {
          brandTypeId = 0;
        } else {
          brandTypeId = tempStepData[2].addCustomerRows.find(
            item => item.id === customerRowId,
          ).brandType.id;
        }
        getBrandListForIdAPI(customerId, brandTypeId) // fr the case if brand has customer filter too
          .then(res => {
            const apiBrandForIdList = res.data.data;
            const brandForIdList = [];
            apiBrandForIdList.forEach(brand => {
              const brandObj = {
                id: brand.brandId,
                value: brand.brandName,
                label: brand.brandName,
              };
              brandForIdList.push(brandObj);
            });

            tempStepData[2].addCustomerRows.find(
              item => item.id === customerRowId,
            ).brandListOnBrandType = brandForIdList;

            // for making default selection for brand to all
            tempStepData[2].addCustomerRows
              .find(item => item.id === customerRowId)
              .brand.push(...brandForIdList);

            changeStepData(tempStepData);
          })
          .catch(err => {
            if (err) {
              // console.log(err);
              // changeStepData(tempStepData);
              changeStepData(tempStepData);
            }
          });
      } else {
        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isDisabled = true;

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).isBrandDisabled = true;

        // tempStepData[2].addCustomerRows.find(
        //   item => item.id === customerRowId,
        // ).hasAnyValue = false;

        tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).brandListOnBrandType = [];
        // this we need to call because if we select all then no api call for geting brnads happens
        changeStepData(tempStepData);
      }
    }
    // changeStepData(tempStepData);
  };

  const handleBrandTypeSelect = (_eventKey, customerRowId) => {
    const selectedVal = brandTypeList.find(item => item.id === _eventKey);
    const tempStepData = [...stepData];

    if (
      tempStepData[2].addCustomerRows.find(item => item.id === customerRowId)
        .brandType.id !== _eventKey
    ) {
      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).hasAnyValue = true;

      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).brandType = selectedVal;

      // check this when we select the brand type i am reseting the brand value to [] array to mandate user to select brands
      tempStepData[2].addCustomerRows.find(
        item => item.id === customerRowId,
      ).brand = [];

      let customerId;
      const brandTypeId = selectedVal.id;
      if (
        Object.keys(
          tempStepData[2].addCustomerRows.find(
            item => item.id === customerRowId,
          ).customer,
        ).length === 0
      ) {
        customerId = 0;
      } else {
        customerId = tempStepData[2].addCustomerRows.find(
          item => item.id === customerRowId,
        ).customer.id;
      }

      if (brandTypeId === 'all') {
        getBrandListForIdAPI(customerId, 0) // fr the case if brand has customer filter too
          .then(res => {
            const apiBrandForIdList = res.data.data;
            const brandForIdList = [];
            apiBrandForIdList.forEach(brand => {
              const brandObj = {
                id: brand.brandId,
                value: brand.brandName,
                label: brand.brandName,
              };
              brandForIdList.push(brandObj);
            });
            // for making default selection for brand to all
            tempStepData[2].addCustomerRows
              .find(item => item.id === customerRowId)
              .brand.push(
                { id: 'all', value: 'All', label: 'All' },
                ...brandForIdList,
              );

            // brandForIdList.unshift({ id: 'all', value: 'All' });

            tempStepData[2].addCustomerRows.find(
              item => item.id === customerRowId,
            ).brandListOnBrandType = brandForIdList;

            tempStepData[2].addCustomerRows.find(
              item => item.id === customerRowId,
            ).isBrandDisabled = false;
            tempStepData[2].addCustomerRows.find(
              item => item.id === customerRowId,
            ).brandError = '';
            changeStepData(tempStepData);
          })
          .catch(err => {
            if (err) {
              // console.log(err);
              changeStepData(tempStepData);
            }
          });
      } else {
        getBrandListForIdAPI(customerId, brandTypeId)
          .then(res => {
            const apiBrandForIdList = res.data.data;
            if (apiBrandForIdList.length > 0) {
              const brandForIdList = [];
              apiBrandForIdList.forEach(brand => {
                const brandObj = {
                  id: brand.brandId,
                  value: brand.brandName,
                  label: brand.brandName,
                };
                brandForIdList.push(brandObj);
              });

              // brandForIdList.unshift({ id: 'all', value: 'All' });
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).brandListOnBrandType = brandForIdList;
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).isBrandDisabled = false;
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).brandError = '';
            } else {
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).brandListOnBrandType = [];
              tempStepData[2].addCustomerRows.find(
                item => item.id === customerRowId,
              ).isBrandDisabled = true;

              setIsErrorMessage(true);
              setErrorMessage(
                displayMessages.USER_AND_ACCESS.STEP_3
                  .ERR_NO_BRNAD_FOR_BRNAD_TYPE,
              );
            }

            changeStepData(tempStepData);
          })
          .catch(err => {
            if (err) {
              // console.log(err);
              changeStepData(tempStepData);
            }
          });
      }
    } // changeStepData(tempStepData);
  };

  // const handleBrandSelect = (_eventKey, customerRowId, customerRowData) => {
  //   // let selectionList;
  //   // if (customerRowData.brandType.id === 'all') {
  //   //   selectionList = brandListAll;
  //   // } else {
  //   //   selectionList = customerRowData.brandListOnBrandType;
  //   // }

  //   const selectionList = customerRowData.brandListOnBrandType;

  //   const selectedVal = selectionList.find(item => item.id === _eventKey);
  //   const tempStepData = [...stepData];

  //   tempStepData[2].addCustomerRows.find(
  //     item => item.id === customerRowId,
  //   ).hasAnyValue = true;

  //   tempStepData[2].addCustomerRows.find(
  //     item => item.id === customerRowId,
  //   ).brand = selectedVal;
  //   changeStepData(tempStepData);
  // };

  const handleBrandSelect = (selectedItems, customerRowId) => {
    const tempStepData = [...stepData];

    tempStepData[2].addCustomerRows.find(
      item => item.id === customerRowId,
    ).brandError = '';

    tempStepData[2].addCustomerRows.find(
      item => item.id === customerRowId,
    ).hasAnyValue = true;

    tempStepData[2].addCustomerRows.find(
      item => item.id === customerRowId,
    ).brand = selectedItems;
    changeStepData(tempStepData);
  };

  const handleAddMoreCustomerRows = () => {
    const tempStepData = [...stepData];
    tempStepData[2].addCustomerRows.push({
      id: tempStepData[2].addCustomerRows.length + 1,
      property: {},
      customer: { id: 'all', value: 'All' },
      brandType: { id: 'all', value: 'All' },
      brand: [{ id: 'all', value: 'All', label: 'All' }],
      brandListOnBrandType: [],
      customerDropDownData: [],
      hasAnyValue: false,
      customerError: '',
      propertyError: '',
      brandError: '',
      isDisabled: true,
      isBrandDisabled: true,
      isCustomerDisabled: true,
    });

    changeStepData(tempStepData);
  };
  return (
    <div className="assign-customer-and-brand">
      <Card>
        <div className="table-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                .TITLE_CUSTOMER_BRAND_ASSIGNED
            }
          />
        </div>
        {assignedCustomer.length > 0 ? (
          <div className="assigned-cust-table">
            <CardListTable
              columns={customerAssignedColumns}
              data={assignedCustomer}
              numOfColumns={customerAssignedColumns.length - 1}
              noDataString={
                labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                  .ASSIGNED_CUSTOMER.NO_CUSTOMER_ASSIGNED
              }
              persistTableHead
              fixedHeader
              fixedHeaderScrollHeight="310px"
            />
          </div>
        ) : (
          <div className="no-table-data">
            {!isAllCustomerBrandAssigned
              ? labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                  .ASSIGNED_CUSTOMER.NO_CUSTOMER_ASSIGNED
              : labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                  .ASSIGNED_CUSTOMER.ALL_CUSTOMER_BRAND_ASSIGNED}
          </div>
        )}
      </Card>
      <Card>
        <div className="add-cust-title">
          <CardHeader
            title={
              labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                .TITLE_ADD_CUSTOMER_BRAND
            }
          />
        </div>
        {stepData[2].addCustomerRows.map(row => {
          return (
            <div className="add-customer-row" key={row.id}>
              <DropdownComponent
                id="property"
                className="add-customer-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                    .PROPERTY_LABEL
                }
                data={[
                  { id: 'select', value: 'Select' },
                  ...selectedPropertyList,
                ]}
                value={row.property ? row.property.value : ''}
                onSelect={_eventKey => handlePropertySelect(_eventKey, row.id)}
                error={row.propertyError ? row.propertyError : ''}
              />
              <DropdownComponent
                id="customer"
                className="add-customer-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                    .CUSTOMER_LABEL
                }
                data={row.customerDropDownData}
                value={row.customer ? row.customer.value : ''}
                onSelect={_eventKey => handleCustomerSelect(_eventKey, row.id)}
                error={row.customerError ? row.customerError : ''}
                isDisabled={row.isCustomerDisabled}
              />
              <DropdownComponent
                id="brandType"
                className="add-customer-row-fields"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                    .BRAND_TYPE_LABEL
                }
                data={brandTypeList}
                value={row.brandType ? row.brandType.value : ''}
                onSelect={_eventKey => handleBrandTypeSelect(_eventKey, row.id)}
                isDisabled={row.isDisabled}
              />
              {/* <DropdownComponent
                id="brand"
                className="add-customer-row-fields"
                noOptionsMessage="No Brands Available"
                label={
                  labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                    .BRAND_LABEL
                }
                // data={
                //   row.brandType && row.brandType.value === 'All'
                //     ? brandListAll
                //     : row.brandListOnBrandType
                // }
                data={row.brandListOnBrandType}
                value={row.brand ? row.brand.value : ''}
                onSelect={_eventKey =>
                  handleBrandSelect(_eventKey, row.id, row)
                }
                isDisabled={row.isDisabled}
              /> */}
              <DropdownMultiSelect
                className="add-customer-row-fields"
                labelName={
                  labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                    .BRAND_LABEL
                }
                data={row.brandListOnBrandType}
                multiSelectDesc="Select Brand"
                value={row.brand}
                onChange={selectedItems =>
                  handleBrandSelect(selectedItems, row.id)
                }
                error={row.brandError}
                helperText={row.brandError ? row.brandError : ''}
                allowSelectAll
                // isDisabled={row.isDisabled}
                isDisabled={row.isBrandDisabled}
              />
            </div>
          );
        })}

        <div className="add-more-customer-rows">
          <LabelWithIcon
            label={
              labelText.USER_AND_ACCESS.ASSIGN_CUSTOMER_AND_BRAND_STEP_3
                .ADD_MORE_ROW_LABEL
            }
            handleClick={handleAddMoreCustomerRows}
          />
        </div>
      </Card>
      <ErrorAlert
        alertMessage={errorMessage}
        primaryButtonText="OK"
        open={isErrorMessage}
        setClose={() => setIsErrorMessage(!isErrorMessage)}
        primaryButtonOnClick={() => setIsErrorMessage(!isErrorMessage)}
      />

      <InformationAlert
        alertMessage={
          displayMessages.USER_AND_ACCESS.STEP_3
            .CONFIRM_ASSIGNED_CUSTOMER_BRAND_DELETE
        }
        primaryButtonText="Yes"
        secondaryButtonText="No"
        open={confirmDeletion}
        setClose={() => setConfirmDeletion(!confirmDeletion)}
        primaryButtonOnClick={() => handleDeleteAssignedCustomer(rowToDelete)}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  stepData: getUserAccessSteps(state),
  customerList: getAssignedCustomerWithAll(state),
  brandTypeList: getBrandTypeListWithAll(state),
  // brandListAll: getBrandListWithAll(state),
  assignedCustomer: getAssignedCustomer(state),
  userId: getUserIdFromState(state),
  isAllCustomerBrandAssigned:
    state.userAccess.userAndAccessSteps[2].isAllCustomerBrandAssigned,
  selectedPropertyList: getSelectedPropertyList(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeStepData: setWizardStepsUserAccess,
      getCustomerListAPI: getCustomerListAPIAction,
      getBrandTypeListAPI: getBrandTypeListAPIAction,
      getBrandListAllAPI: getBrandListAllAPIAction,
      getBrandListForIdAPI: getBrandListForIdAPIAction,
      getAssignedCustomerAPI: getAssignedCustomerAPIAction,
      deleteCustomerAndBrandAssignedAPI: deleteCustomerAndBrandAssignedAPIAction,
      getSelectedPropertyListAPI: getSelectedPropertyListAPIAction,
      getAssignedAccessAPI: getAssignedAccessAPIAction,
      getCustomerListByPropertyAPI: getCustomerListByPropertyAPIAction,
    },
    dispatch,
  );

AssignCustomerAndBrand.propTypes = {
  stepData: PropTypes.instanceOf(Array).isRequired,
  changeStepData: PropTypes.func.isRequired,
  // customerList: PropTypes.instanceOf(Array).isRequired,
  // getCustomerListAPI: PropTypes.func.isRequired,
  brandTypeList: PropTypes.instanceOf(Array).isRequired,
  getBrandTypeListAPI: PropTypes.func.isRequired,
  // getBrandListAllAPI: PropTypes.func.isRequired,
  // brandListAll: PropTypes.instanceOf(Array).isRequired,
  getBrandListForIdAPI: PropTypes.func.isRequired,
  getAssignedCustomerAPI: PropTypes.func.isRequired,
  assignedCustomer: PropTypes.instanceOf(Array).isRequired,
  isEditUserReq: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  deleteCustomerAndBrandAssignedAPI: PropTypes.func.isRequired,
  isAllCustomerBrandAssigned: PropTypes.bool.isRequired,
  getSelectedPropertyListAPI: PropTypes.bool.isRequired,
  selectedPropertyList: PropTypes.instanceOf(Array).isRequired,
  getAssignedAccessAPI: PropTypes.func.isRequired,
  getCustomerListByPropertyAPI: PropTypes.func.isRequired,
};

AssignCustomerAndBrand.defaultProps = {
  userId: '',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignCustomerAndBrand);
