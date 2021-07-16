export default {
  success: true,
  message: 'get Form design response',
  data: [
    {
      formDeisgn: [
        {
          refId: 'a7068f58-8332-45e7-95d7-c9a0a16e2d33',
          ctName: 'case-type-1',
          sphName: 'sub phase',
          formName: 'form-design-1',
          updatedAt: '27 May, 2020',
          editor: {
            refId: '00fa7dd5-aa99-43c9-acd7-40144693dc7b',
            name: 'a as',
          },
        },
        {
          refId: 'e331c270-092f-4b95-b92e-f19d254d06da',
          ctName: 'case-type-1',
          sphName: 'sub phase',
          formName: 'form-design-2',
          updatedAt: '27 May, 2020',
          editor: {
            refId: '00fa7dd5-aa99-43c9-acd7-40144693dc7b',
            name: 'a as',
          },
        },
      ],
      totalCount: 2,
    },
  ],
};

export const caseTypes = {
  success: true,
  message: 'getCaseTypes',
  data: [
    {
      refId: 'd445e6ae-1209-47ac-a564-d926c50bb821',
      cname: 'New Fit-out',
    },
    {
      refId: 'd445e6ae-1209-47ac-a564-d926c50bb822',
      cname: 'Renovation',
    },
    {
      refId: 'd445e6ae-1209-47ac-a564-d926c50bb823',
      cname: 'Re-furbish',
    },
  ],
};

export const designSubPhases = {
  success: true,
  message: 'get subphases successfully',
  data: [
    {
      subPhaseId: '35719471-9a6f-4159-826f-cf9c2db7d2c7',
      sName: 'Design 2',
    },
    {
      subPhaseId: '3def74e2-d877-4e94-b13c-2d57c1b34e9f',
      sName: 'Design 1',
    },
    {
      subPhaseId: 'bc8749f2-da94-4c6e-8a8d-02a607659a88',
      sName: 'Close design phase',
    },
  ],
};

export const fileTypeOptions = [
  { value: '1', label: '.zip' },
  { value: '2', label: '.pdf' },
  { value: '3', label: '.png' },
  { value: '4', label: '.jpeg' },
  { value: '5', label: '.doc' },
];

// const dataOfFileTypes = {
//   success: true,
//   message: 'Get File Type Response',
//   data: [
//     {
//       ext: '.jpeg',
//       fileType: 'JPEG image',
//       mimeType: 'image/jpeg',
//       refId: 'e8af782b-6c5b-4f41-9085-d64899f0af69',
//     },
//     {
//       ext: '.pdf',
//       fileType: 'Portable Document Format ',
//       mimeType: 'application/pdf',
//       refId: '8c1343db-fe6b-45bf-921f-afc99650d60b',
//     },
//     {
//       ext: '.xls',
//       fileType: 'Microsoft Excel',
//       mimeType: 'application/vnd.ms-excel',
//       refId: 'feea6fc5-5a0d-4e89-861f-3afe7cbe847d',
//     },
//     {
//       ext: '.png',
//       fileType: 'Portable Network Graphics',
//       mimeType: 'image/png',
//       refId: '458d1671-e914-4184-8a4b-7292fdf07c37',
//     },
//     {
//       ext: '.zip',
//       fileType: 'ZIP archive',
//       mimeType: 'application/zip',
//       refId: 'a55a8bc0-dee7-4581-8164-f93f7e0a7753',
//     },
//     {
//       ext: '.docx',
//       fileType: 'Microsoft Word',
//       mimeType:
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       refId: '6f0e71ed-befa-4b78-9d8e-55d9e6eff8b1',
//     },
//     {
//       ext: '.doc',
//       fileType: 'Microsoft Word',
//       mimeType: 'application/msword',
//       refId: 'aea6e21d-9fe4-4483-a3ff-fcd95805274b',
//     },
//     {
//       ext: '.jpe',
//       fileType: 'JPEG image',
//       mimeType: 'image/jpeg',
//       refId: '69b6d1c3-72ff-4453-9242-9245ee294ca4',
//     },
//     {
//       ext: '.jpg',
//       fileType: 'JPEG image',
//       mimeType: 'image/jpeg',
//       refId: 'a1766411-1085-4873-a93c-a8bd3a2ab991',
//     },
//     {
//       ext: '.tif,.tiff',
//       fileType: 'Tagged Image File Format (TIFF)',
//       mimeType: 'image/tiff',
//       refId: '2fca0cda-98fa-4266-953f-789f647ab611',
//     },
//     {
//       ext: '.xlsx',
//       fileType: 'Microsoft Excel',
//       mimeType:
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       refId: '4e445e1d-9b34-4308-8543-2ea1c0de5e91',
//     },
//     {
//       ext: '.gif',
//       fileType: 'graphic interchange format',
//       mimeType: 'image/gif',
//       refId: 'f691f440-3eee-40d7-bc55-a2098e8a1912',
//     },
//   ],
// };

// {
//   "formId": "424ed278-32f9-458f-a60d-b0023e82895f",
//   "isPublish": false,
//   "sectionsFiles": [
//     {
//       "labels": [
//         {
//           "languageCode": "en",
//           "label": "file 1"
//         },
//         {
//           "languageCode": "zh",
//           "label": "file 1"
//         }
//       ],
//       "sectionId": 1,
//       "fTypes": [
//         {
//           "fileType": "JPEG image"
//         },
//         {
//           "fileType": "Portable Document Format "
//         },
//         {
//           "fileType": "Microsoft Excel"
//         }
//       ],
//       "fTypesExt": [
//         {
//           "value": ".jpeg"
//         },
//         {
//           "value": ".pdf"
//         },
//         {
//           "value": ".xls"
//         }
//       ]
//     },
//     {
//       "labels": [
//         {
//           "languageCode": "en",
//           "label": "file2"
//         },
//         {
//           "languageCode": "zh",
//           "label": "file2"
//         }
//       ],
//       "sectionId": 1,
//       "fTypes": [
//         {
//           "fileType": "Portable Document Format "
//         },
//         {
//           "fileType": "Microsoft Excel"
//         }
//       ],
//       "fTypesExt": [
//         {
//           "value": ".pdf"
//         },
//         {
//           "value": ".xls"
//         }
//       ]
//     }
//   ]
// }

// {
//   "formId": "b084309e-700a-4c90-ac92-e57fa0a1b6b5",
//   "sections": [
//     {
//       "sectionUuid": "1bffb759-8d70-4dd0-a2b4-aaae56b668c7",
//       "names": [
//         {
//           "languageCode": "zh",
//           "name": "section 1234"
//         },
//         {
//           "languageCode": "en",
//           "name": "section 123"
//         }
//       ]
//     },
//     {
//       "sectionUuid": "e001ebf9-003e-4341-bf19-5031a57db4ab",
//       "names": [
//         {
//           "languageCode": "zh",
//           "name": "Section 2345"
//         },
//         {
//           "languageCode": "en",
//           "name": "Section 234"
//         }
//       ]
//     }
//   ]
// }

// const responsedata = {
//   success: true,
//   message: 'Get Form Design Detail response',
//   data: [
//     {
//       formId: '66b0ec40-7855-4ccf-8c50-f7de5ac43a53',
//       phId: '39cde21e-6363-42b3-b562-dc34ed97a97c',
//       sphId: '35719471-9a6f-4159-826f-cf9c2db7d2c7',
//       ctId: '791e9fac-339a-4870-b893-5ec1e27b2e93',
//       names: [
//         {
//           languageCode: 'en',
//           name: 'form-d-form-1',
//         },
//       ],
//       notesAndSpecifications: [
//         {
//           languageCode: 'en',
//           note: '',
//           specification: '',
//         },
//       ],
//       sections: [],
//       otherFiles: [],
//     },
//   ],
// };
