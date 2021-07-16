import { createSelector } from 'reselect';

export const getUserAccessSteps = state => state.userAccess.userAndAccessSteps;

export const getCompanyList = state =>
  state.userAccess.userAndAccessSteps[1].companyList;

export const getCompanyListForDD = createSelector(
  [getCompanyList],
  companyList => {
    return companyList.map(company => {
      return {
        id: company.companyId,
        value: company.companyName,
      };
    });
  },
);

export const getCustomerList = state =>
  state.userAccess.userAndAccessSteps[2].customerList;

export const getCustomerListForDD = createSelector(
  [getCustomerList],
  customerList => {
    return customerList.map(customer => {
      return {
        id: customer.customerId,
        value: customer.customerName,
      };
    });
  },
);

export const getAssignedCustomerWithAll = createSelector(
  [getCustomerListForDD],
  customerListMod => {
    customerListMod.unshift({ id: 'all', value: 'All' });
    return customerListMod;
  },
);

export const getBrandTypeList = state =>
  state.userAccess.userAndAccessSteps[2].brandTypeList;

export const getBrandList = state =>
  state.userAccess.userAndAccessSteps[2].brandList;

export const getSelectedPropertyList = state =>
  state.userAccess.userAndAccessSteps[3].selectedPropertyList;

export const getBrandTypeListForDD = createSelector(
  [getBrandTypeList],
  brandTypeList => {
    return brandTypeList.map(brandType => {
      return {
        id: brandType.brandTypeId,
        value: brandType.brandType,
      };
    });
  },
);

export const getBrandTypeListWithAll = createSelector(
  [getBrandTypeListForDD],
  brandTypeList => {
    brandTypeList.unshift({ id: 'all', value: 'All' });
    return brandTypeList;
  },
);

export const getBrandListForDD = createSelector([getBrandList], brandList => {
  return brandList.map(brand => {
    return {
      id: brand.brandId,
      value: brand.brandName,
    };
  });
});

export const getBrandListWithAll = createSelector(
  [getBrandListForDD],
  brandList => {
    brandList.unshift({ id: 'all', value: 'All' });
    return brandList;
  },
);

export const getRolesList = state =>
  state.userAccess.userAndAccessSteps[3].rolesList;

// export const getRoleListWithLabel = createSelector(
//   [getRolesList],
//   rolesList => {
//     return rolesList.map(role => {
//       return {
//         id: role.roleId,
//         value: role.roleName,
//         label: role.roleName,
//       };
//     });
//   },
// );

export const getUserList = state => state.userAccess.userList;

export const getUserListModified = createSelector([getUserList], userList => {
  return userList.map(user => {
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      approved: user.isApproved
        ? { id: '1', value: 'Yes' }
        : { id: '2', value: 'No' },
      active: user.isActive
        ? { id: '1', value: 'Yes' }
        : { id: '2', value: 'No' },
      userType: user.userType,
    };
  });
});

export const getUserTypeList = state => state.userAccess.userTypeList;
// DD means dropdown
export const getUserTypeListForDD = createSelector(
  [getUserTypeList],
  userTypeList => {
    return userTypeList.map(userType => {
      return {
        id: userType.userTypesId,
        value: userType.userType,
      };
    });
  },
);

export const getUserTypeListForAddUpdate = createSelector(
  [getUserTypeList],
  userTypeList => {
    return userTypeList.map(userType => {
      return {
        id: userType.userTypesId,
        value: userType.userType,
      };
    });
  },
);

export const getUserTypeListForFilterDD = createSelector(
  [getUserTypeListForDD],
  userTypeListFilter => {
    userTypeListFilter.unshift({ id: 'all', value: 'All' });
    return userTypeListFilter;
  },
);

export const getUserAccessPropertyList = state =>
  state.header.propertyAccessList;

export const getUserAccessProprtyListForDD = createSelector(
  [getUserAccessPropertyList],
  propetyList => {
    return propetyList.map(property => {
      return {
        id: property.key,
        value: property.text,
      };
    });
  },
);

export const getUserAccessProprtyListForFilterDD = createSelector(
  [getUserAccessProprtyListForDD],
  propertyListFilter => {
    propertyListFilter.unshift({ id: 'all', value: 'All' });
    return propertyListFilter;
  },
);

export const getAssignedAccess = state =>
  state.userAccess.userAndAccessSteps[1].assignedAccess;
export const getAssignedCustomer = state =>
  state.userAccess.userAndAccessSteps[2].assignedCustomer;

export const getAssignedDepartmentAndRole = state =>
  state.userAccess.userAndAccessSteps[3].assignedDepartmentAndRoles;

export const getUserAccessTypeList = state =>
  state.userAccess.userAccessTypeList;

export const getUserIdFromState = state => state.userAccess.userId;
