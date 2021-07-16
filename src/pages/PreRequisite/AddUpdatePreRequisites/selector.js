// import { createSelector } from 'reselect';

// export const getPreRequisiteFieldList = state =>
//   state.prerequisiteList.fieldList;

// // export const getPrerequisiteNames = state =>
// //   state.prerequisiteList.prerequisiteDetails;

// export const getPrerequisiteAPIResponse = state =>
//   state.prerequisiteList.prerequisiteDetails;

// // export const getPrerequisiteFieldDetails = state =>
// //   state.prerequisiteList.prerequisiteDetails.details;

// const lang = [
//   {
//     language: 'english',
//     languageCode: 'en',
//   },
//   {
//     language: 'arabic',
//     languageCode: 'ar',
//   },
//   {
//     language: 'french',
//     languageCode: 'fr',
//   },
// ];

// /* param{arr} is the array of object where to check according to language, if empty object not present in arr for the enabled language
// then insert {name:'', languageCode:'en/fr/ar/...'} */

// const insertEmptyObjectsIn = arr => {
//   if (arr.length === lang.length) {
//     return arr;
//   }
//   lang.forEach(locale => {
//     if (!arr.find(arrObj => arrObj.languageCode === locale.languageCode))
//       arr.push({
//         name: '',
//         languageCode: locale.languageCode,
//       });
//   });
//   return arr;
// };

// export const getPreRequisiteFieldListWithLabels = createSelector(
//   [getPreRequisiteFieldList],
//   fieldList => {
//     fieldList.map(field => {
//       const labels = field.labelNames;
//       console.log(labels, 'labels array');
//       const modifiedLabels = insertEmptyObjectsIn(labels);

//       return modifiedLabels;
//     });
//     return fieldList;
//   },
// );

// export const getPrerequisiteAPIResponseWithLabels = createSelector(
//   [getPrerequisiteAPIResponse, getPreRequisiteFieldList],
//   (responseData, fieldList) => {
//     const modifiedResponse = responseData;
//     if (responseData.names && responseData.details) {
//       // modifying name array
//       const nameArr = modifiedResponse.names;
//       const modifiedNameArr = insertEmptyObjectsIn(nameArr);
//       modifiedResponse.names = modifiedNameArr;
//       const prerequisiteFieldDetails = modifiedResponse.details;
//       if (prerequisiteFieldDetails.length !== fieldList.length) {
//         fieldList.forEach(fieldObj => {
//           if (
//             !prerequisiteFieldDetails.find(
//               item => item.field === fieldObj.field,
//             )
//           ) {
//             prerequisiteFieldDetails.push(fieldObj);
//           }
//         });
//       }
//       prerequisiteFieldDetails.map(prerequisiteField => {
//         const prerequisiteFieldLabels = prerequisiteField.labelNames;
//         const modifiedPrerequisiteFieldLabels = insertEmptyObjectsIn(
//           prerequisiteFieldLabels,
//         );
//         return modifiedPrerequisiteFieldLabels;
//       });
//     }
//     return modifiedResponse;
//   },
// );

// // export const getPrerequisiteNamesWithLabels = createSelector(
// //   [getPrerequisiteNames],
// //   nameArr => {
// //     console.log(nameArr, 'sdsf');
// //     const modifiedNameArr = insertEmptyObjectsIn(nameArr.names);

// //     return modifiedNameArr;
// //   },
// // );

// // export const getPrerequisiteFieldDetailsWithLabels = createSelector(
// //   [getPrerequisiteFieldDetails, getPreRequisiteFieldList],
// //   (prerequisiteFieldDetails, fieldList) => {
// //     if (prerequisiteFieldDetails.length !== fieldList.length) {
// //       fieldList.forEach(fieldObj => {
// //         if (
// //           !prerequisiteFieldDetails.find(item => item.field === fieldObj.field)
// //         ) {
// //           prerequisiteFieldDetails.push(fieldObj);
// //         }
// //       });
// //     }
// //     prerequisiteFieldDetails.map(prerequisiteField => {
// //       const prerequisiteFieldLabels = prerequisiteField.labelNames;
// //       const modifiedPrerequisiteFieldLabels = insertEmptyObjectsIn(
// //         prerequisiteFieldLabels,
// //       );
// //       return modifiedPrerequisiteFieldLabels;
// //     });
// //     return prerequisiteFieldDetails;
// //   },
// // );
