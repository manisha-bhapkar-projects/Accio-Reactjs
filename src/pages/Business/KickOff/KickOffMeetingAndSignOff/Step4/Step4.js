/**
 * Step4 :
 *  Preview Mom and sign off
 */

import React, { useEffect } from 'react';
import PdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import { useTranslation } from 'react-i18next';

import './Step4.scss';
import { scrollToTop } from '../../../../../utils/utils';

PdfMake.vfs = pdfFonts.pdfMake.vfs;
// PdfMake.fonts = {
//   Hindi: {
//     // normal: 'NotoSans-Regular.ttf',
//     // bold: 'NotoSans-Bold.ttf',
//     // italics: 'NotoSans-Italic.ttf',
//     // bolditalics: 'NotoSans-BoldItalic.ttf',
//     normal: `${window.location.origin}/assets/fonts/Hindi/NotoSans-Regular.ttf`,
//     bold: `${window.location.origin}/assets/fonts/Hindi/NotoSans-Regular.ttf`,
//     italics: `${window.location.origin}/assets/fonts/Hindi/NotoSans-Regular.ttf`,
//     bolditalics: `${window.location.origin}/assets/fonts/Hindi/NotoSans-Regular.ttf`,
//     // normal: NotoSans,
//     // bold: NotoSans,
//     // italics: NotoSans,
//     // bolditalics: NotoSans,
//   },
//   Chinese: {
//     normal: `${window.location.origin}/assets/fonts/Chinese/ZCOOLXiaoWei-Regular.ttf`,
//     bold: `${window.location.origin}/assets/fonts/Chinese/ZCOOLXiaoWei-Regular.ttf`,
//     italics: `${window.location.origin}/assets/fonts/Chinese/ZCOOLXiaoWei-Regular.ttf`,
//     bolditalics: `${window.location.origin}/assets/fonts/Chinese/ZCOOLXiaoWei-Regular.ttf`,
//   },
// };
const Step4 = () => {
  const { t } = useTranslation();

  // English
  const design = {
    header: {
      isImg: 'true',
      url: '',
      text: 'THE MALL OF UAE',
    },
    footer: 'FOOTER',
    attendees: [
      {
        name: 'Sirius Black',
        role: 'Tenant Cordinator Head',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Herry Potter',
        role: 'Tenant Cordinator',
        organisation: 'The Mall Of UAE',
        isAttended: 'Yes',
      },
      {
        name: 'Hermione Granger',
        role: 'Designer',
        organisation: 'The Mall Of UAE',
        isAttended: 'Yes',
      },
      {
        name: 'Ron Weasley',
        role: 'MEP Head',
        organisation: 'The Mall Of UAE',
        isAttended: 'Yes',
      },
      {
        name: 'Severus Snape',
        role: 'Electrical Engineer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Viktor Krum',
        role: 'Structural Engineer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Pravati Patil',
        role: 'Designer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Tom Riddle',
        role: 'Tenant Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },
      {
        name: 'Cedric Diggory',
        role: 'Authorised Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },
      {
        name: 'Pravati Patil',
        role: 'Designer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Tom Riddle',
        role: 'Tenant Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },
      {
        name: 'Cedric Diggory',
        role: 'Authorised Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },
      {
        name: 'Pravati Patil',
        role: 'Designer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },

      {
        name: 'Pravati Patil',
        role: 'Designer',
        organisation: 'The Mall Of UAE',
        isAttended: 'No',
      },
      {
        name: 'Tom Riddle',
        role: 'Tenant Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },

      {
        name: 'Cedric Diggory',
        role: 'Authorised Representative',
        organisation: 'Alshaya Group',
        isAttended: 'Yes',
      },
    ],
    phases: [
      {
        phase: 'KICK-OFF',
        budgetedDate: '5-JAN-2019',
        plannedDate: '5-JAN-2019',
        comment: {
          owner: '',
          tenant: '',
        },
        actions: [
          {
            phase: 'SCHEDULE KICK-OFF',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'ASSIGN TENANT TEAM & CONTRACTOR',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
        ],
      },
      {
        phase: 'DESIGN',
        budgetedDate: '',
        plannedDate: '',
        comment: {
          owner: 'This is owner comment.This is owner comment.',
          tenant: 'This is tenant comment.This is tenant comment.',
        },
        actions: [
          {
            phase: 'SUBMIT INITIAL CONCEPT DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'REVIEW INITIAL CONCEPT DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'APPROVE INITIAL CONCEPT DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'SUBMIT FINAL DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'REVIEW FINAL DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'APPROVE FINAL DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CLOSE DESIGN',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
        ],
      },
      {
        phase: 'UNIT HANDOVER AND FITOUT',
        budgetedDate: '',
        plannedDate: '',
        comment: {
          owner: 'This is owner comment.This is owner comment.',
          tenant: 'This is tenant comment.This is tenant comment.',
        },
        actions: [
          {
            phase: 'UNIT HANDOVER',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'REQUEST INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'REQUEST INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CLOSE UNIT HANDOVER AND FITOUT',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
        ],
      },
      {
        phase: 'UNIT OPENING',
        budgetedDate: '',
        plannedDate: '',
        comment: {
          owner: 'This is owner comment.This is owner comment.',
          tenant: 'This is tenant comment.This is tenant comment.',
        },
        actions: [
          {
            phase: 'REQUEST INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'REQUEST INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'START TRADING',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'CLOSE UNIT OPENING',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
        ],
      },
      {
        phase: 'CLOSURE',
        budgetedDate: '',
        plannedDate: '',
        comment: {
          owner: 'This is owner comment.This is owner comment.',
          tenant: 'This is tenant comment.This is tenant comment.',
        },
        actions: [
          {
            phase: 'REQUEST INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 1',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'REQUEST INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CONDUCT INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
          {
            phase: 'COMPLETE INSPECTION 2',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: '',
              tenant: '',
            },
          },
          {
            phase: 'CLOSE CLOSURE',
            budgetedDate: '',
            plannedDate: '',
            comment: {
              owner: 'This is owner comment.This is owner comment.',
              tenant: 'This is tenant comment.This is tenant comment.',
            },
          },
        ],
      },
    ],
    meetingNotes:
      '<p>AGENDA:</p><div><div>To discuss, review and sign-off on the schedule for the fit out of Debenhams store at The Mall Of UAE.</div><div><br></div><div><div><span>POINT&nbsp;DISCUSSED:</span></div><ol><li>&nbsp; &nbsp; &nbsp; POINT ONE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; POINT TWO: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; POINT THREE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li></ol></div><div><br></div><div><div><span>ACTION ITEMS:</span></div><ol><li>&nbsp; &nbsp; &nbsp; ITEM ONE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; ITEM TWO: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; ITEM THREE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li></ol><p><br></p></div><br><p><br></p></div><p><br></p><p><br></p>',
    caseDetails: {
      meeting: t(
        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.KICK_OFF_MEETING',
      ),
      date: '7-NOV-2019',
      time: '11:30 AM TO 12:30 PM',
      property: 'The Mall Of UAE',
      customer: 'ALSHAYA GROUP',
      unit: 'GL-101,GL-102,GL-103,GL-104',
      fitoutPeriod: '120 days',
      onBehalfOf: {
        owner: {
          organisation: 'THE MALL OF UAE',
          name: 'HARRY POTTER',
          role: 'TENANT CORDINATOR',
        },
        tenant: {
          organisation: 'ALSHAYA GROUP',
          name: 'TOM RIDDLE',
          role: 'TENANT REPRESENTATIVE',
        },
      },
    },
  };

  // Hindi
  // const design = {
  //   header: {
  //     isImg: 'true',
  //     url: '',
  //     // text: 'THE MALL OF UAE',
  //     text: 'संयुक्त अरब अमीरात का माल',
  //   },
  //   footer: 'FOOTER',
  //   attendees: [
  //     {
  //       name: 'Sirius Black',
  //       role: 'Tenant Cordinator Head',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Herry Potter',
  //       role: 'Tenant Cordinator',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Hermione Granger',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Ron Weasley',
  //       role: 'MEP Head',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Severus Snape',
  //       role: 'Electrical Engineer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Viktor Krum',
  //       role: 'Structural Engineer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },

  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },

  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //   ],
  //   phases: [
  //     {
  //       phase: 'शुरू करना',
  //       budgetedDate: '5-JAN-2019',
  //       plannedDate: '5-JAN-2019',
  //       comment: {
  //         owner: '',
  //         tenant: '',
  //       },
  //       actions: [
  //         {
  //           phase: 'अनुसूची किक बंद',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'टेनेंट टीम और ठेकेदार को सौंपें',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: 'डिज़ाइन',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //         tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //       },
  //       actions: [
  //         {
  //           phase: 'प्रस्तुत प्रारंभिक अवधारणा डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'समीक्षा प्रारंभिक अवधारणा डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'मंजूर प्रारंभिक अवधारणा डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'सब्मिट फाइनल डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अंतिम डिजाइन की समीक्षा करें',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'अंतिम डिजाइन डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'बंद डिजाइन',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: 'यूनिट हैंडओवर और फिटमेंट',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //         tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //       },
  //       actions: [
  //         {
  //           phase: 'यूनिट हैण्डओवर',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'अनुरोध निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अवधारणा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'पूरा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अनुरोध निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'बंद करो और सौंप दो',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: 'यूनिट उद्घाटन',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //         tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //       },
  //       actions: [
  //         {
  //           phase: 'अनुरोध निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अवधारणा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'पूरा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अनुरोध निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अवधारणा निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'पूरा निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'स्टार्ट ट्रेडिंग',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'बंद करे यूनिट उद्घाटन ',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: 'बंद',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //         tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //       },
  //       actions: [
  //         {
  //           phase: 'अनुरोध निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अवधारणा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'पूरा निरीक्षण 1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अनुरोध निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'अवधारणा निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //         {
  //           phase: 'पूरा निरीक्षण 2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: 'बंद करो बंद करो',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: 'यह स्वामी की टिप्पणी है। यह स्वामी की टिप्पणी है।',
  //             tenant: 'यह किरायेदार टिप्पणी है। यह किरायेदार टिप्पणी है।',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   meetingNotes:
  //     // '<p>AGENDA:</p><div><div>To discuss, review and sign-off on the schedule for the fit out of Debenhams store at The Mall Of UAE.</div><div><br></div><div><div><span>POINT&nbsp;DISCUSSED:</span></div><ol><li>&nbsp; &nbsp; &nbsp; POINT ONE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; POINT TWO: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; POINT THREE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li></ol></div><div><br></div><div><div><span>ACTION ITEMS:</span></div><ol><li>&nbsp; &nbsp; &nbsp; ITEM ONE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; ITEM TWO: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li><li>&nbsp; ITEM THREE: This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.This is point one.</li></ol><p><br></p></div><br><p><br></p></div><p><br></p><p><br></p>',
  //     '<p><strong>कार्यसूची:</strong><br>मॉल संयुक्त अरब अमीरात के कम से डेबेनहैम्स दुकान से बाहर फिट करने के लिए समय पर चर्चा करने के लिए, समीक्षा और साइन-ऑफ़।</p><p><strong>सूत्री व्याख्या की गई:</strong></p><p><br>दशमलव एक:</p><ol><li>प्रति सामूहिक वास्तविक केन्द्रिय होभर हिंदी ।क गटकउसि है।अभी विवरण हुएआदि परिभाषित प्रतिबध्दता कोहम मानव बेंगलूर शारिरिक निरपेक्ष कार्य खरिदे करते सहायता बिन्दुओ मजबुत पडता अनुकूल निर्देश सिद्धांत लेने किएलोग अंतर्गत वैश्विक उन्हे</li><li>हुएआदि विनिमय अथवा लक्षण गुजरना खरिदने सभिसमज खरिदे सुना विभाग उसीएक् मुश्किले करने वास्तविक केन्द्रित विषय प्रति व्यवहार प्राधिकरन विश्वव्यापि लोगो विशेष</li><li>मानव बलवान हमेहो। गयेगया कार्यकर्ता सहायता सम्पर्क कार्यकर्ता चाहे विवरण विश्व नयेलिए वेबजाल सोफ़्टवेर पडता जिवन समाजो पत्रिका विकेन्द्रियकरण तकरीबन प्रसारन सम्पर्क लेने मुक्त गुजरना उद्योग विभाजन अतित संदेश पहोचने बेंगलूर व्याख्यान बनाति सहित दिये चुनने क्षमता उद्योग वातावरण सकती लक्षण परस्पर भेदनक्षमता</li><li>अधिक प्राप्त बीसबतेबोध करके(विशेष दौरान जिम्मे दुनिया स्वतंत्र प्राण लिये संदेश खयालात परिवहन भीयह उनका गुजरना वैश्विक हार्डवेर ध्वनि प्रमान परस्पर जानकारी संसाध वहहर देते पहेला ब्रौशर अंतर्गत मुश्किले आजपर नयेलिए व्यवहार चिदंश रचना लक्ष्य मानसिक क्षमता। बनाति वहहर शीघ्र मुख्यतह हार्डवेर विश्वव्यापि स्थिति पत्रिका कोहम कार्य</li></ol><p>&nbsp;</p>',
  //   caseDetails: {
  //     meeting: t(
  //       'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.KICK_OFF_MEETING',
  //     ),
  //     date: '7-NOV-2019',
  //     time: '11:30 AM TO 12:30 PM',
  //     property: 'The Mall Of UAE',
  //     customer: 'ALSHAYA GROUP',
  //     unit: 'GL-101,GL-102,GL-103,GL-104',
  //     fitoutPeriod: '120 days',
  //     onBehalfOf: {
  //       owner: {
  //         organisation: 'THE MALL OF UAE',
  //         name: 'HARRY POTTER',
  //         role: 'TENANT CORDINATOR',
  //       },
  //       tenant: {
  //         organisation: 'ALSHAYA GROUP',
  //         name: 'TOM RIDDLE',
  //         role: 'TENANT REPRESENTATIVE',
  //       },
  //     },
  //   },
  // };

  // chinese
  // const design = {
  //   header: {
  //     isImg: 'true',
  //     url: '',
  //     text: 'THE MALL OF UAE',
  //   },
  //   footer: 'FOOTER',
  //   attendees: [
  //     {
  //       name: 'Sirius Black',
  //       role: 'Tenant Cordinator Head',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Herry Potter',
  //       role: 'Tenant Cordinator',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Hermione Granger',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Ron Weasley',
  //       role: 'MEP Head',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Severus Snape',
  //       role: 'Electrical Engineer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Viktor Krum',
  //       role: 'Structural Engineer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },

  //     {
  //       name: 'Pravati Patil',
  //       role: 'Designer',
  //       organisation: 'The Mall Of UAE',
  //       isAttended: 'No',
  //     },
  //     {
  //       name: 'Tom Riddle',
  //       role: 'Tenant Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },

  //     {
  //       name: 'Cedric Diggory',
  //       role: 'Authorised Representative',
  //       organisation: 'Alshaya Group',
  //       isAttended: 'Yes',
  //     },
  //   ],
  //   phases: [
  //     {
  //       phase: '开始',
  //       budgetedDate: '5-JAN-2019',
  //       plannedDate: '5-JAN-2019',
  //       comment: {
  //         owner: '',
  //         tenant: '',
  //       },
  //       actions: [
  //         {
  //           phase: '时间表开始',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '分配租户团队和承包商',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: '设计',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: '这是所有者评论。这是所有者评论。',
  //         tenant: '这是房客评论。这是房客评论。',
  //       },
  //       actions: [
  //         {
  //           phase: '提交初始概念设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '回顾初始概念设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '批准初始概念设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '提交最终设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '审查最终设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '批准最终设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '贴身设计',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: '单位移交和装修',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: '这是所有者评论。这是所有者评论。',
  //         tenant: '这是房客评论。这是房客评论。',
  //       },
  //       actions: [
  //         {
  //           phase: '单位交接',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '请求检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '要求检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '关闭单元移交和装修',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: '单位开张',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: '这是所有者评论。这是所有者评论。',
  //         tenant: '这是房客评论。这是房客评论。',
  //       },
  //       actions: [
  //         {
  //           phase: '请求检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '要求检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '开始交易',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '关门开启',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       phase: '关闭',
  //       budgetedDate: '',
  //       plannedDate: '',
  //       comment: {
  //         owner: '这是所有者评论。这是所有者评论。',
  //         tenant: '这是房客评论。这是房客评论。',
  //       },
  //       actions: [
  //         {
  //           phase: '请求检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查1',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '要求检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '进行检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //         {
  //           phase: '全面检查2',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '',
  //             tenant: '',
  //           },
  //         },
  //         {
  //           phase: '关闭',
  //           budgetedDate: '',
  //           plannedDate: '',
  //           comment: {
  //             owner: '这是所有者评论。这是所有者评论。',
  //             tenant: '这是房客评论。这是房客评论。',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   meetingNotes:
  //     '<p>议程<br>根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。</p><ul><li>根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。</li><li>根据时间表在阿联酋购物中心的商店进行讨论，审查和注销根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。。</li><li>根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。</li><li>根据时间表在阿联酋购物中心的商店进行讨</li><li>根据时间表在阿联酋购物中心的商店进行讨论，审查和注销。论，审查和注销。</li></ul>',
  //   caseDetails: {
  //     meeting: t(
  //       'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.KICK_OFF_MEETING',
  //     ),
  //     date: '7-NOV-2019',
  //     time: '11:30 AM TO 12:30 PM',
  //     property: 'The Mall Of UAE',
  //     customer: 'ALSHAYA GROUP',
  //     unit: 'GL-101,GL-102,GL-103,GL-104',
  //     fitoutPeriod: '120 days',
  //     onBehalfOf: {
  //       owner: {
  //         organisation: 'THE MALL OF UAE',
  //         name: 'HARRY POTTER',
  //         role: 'TENANT CORDINATOR',
  //       },
  //       tenant: {
  //         organisation: 'ALSHAYA GROUP',
  //         name: 'TOM RIDDLE',
  //         role: 'TENANT REPRESENTATIVE',
  //       },
  //     },
  //   },
  // };

  // https://www.papersizes.org/a-sizes-in-pixels.htm
  const pageSize = {
    width: 595,
    height: 842,
  };
  const gutterSize = 40;
  const contentGutterSize = gutterSize + 10;

  // const PDF = {
  //   KICK_OFF_MEETING: 'KICK-OFF MEETING',
  //   DATE: 'DATE',
  //   TIME: 'TIME',
  //   PROPERTY: 'PROPERTY',
  //   CUSTOMER: 'CUSTOMER',
  //   BRAND: 'BRAND',
  //   UNIT: 'UNIT',
  //   FITOUT_PERIOD: 'FITOUT PERIOD',
  //   CASE: 'CASE #',
  //   ATTENDEES: 'ATTENDEES:',
  //   NAME: 'NAME',
  //   ROLE: 'ROLE',
  //   ORGANISATION: 'ORGANISATION',
  //   ATTENDED: 'ATTENDED?',
  //   NOTES_AND_COMMENTS: 'NOTES & COMMENTS',
  //   SCHEDULE: 'SCHEDULE REVIEWED AND AGREED:',
  //   PHASES: 'PHASE/SUBPHASE',
  //   BUDGETED_DATE: 'BUDGETED COMPLETION DATE',
  //   PLANNED_DATE: 'PLANNED COMPLETION DATE',
  //   COMMENTS: 'COMMENTS',
  //   SIGNED: 'SIGNED BY',
  //   PAGE: 'Page',
  //   OF: 'of',
  // };

  useEffect(() => {
    scrollToTop();
  }, []);
  useEffect(() => {
    generatePDF();
  }, []);

  // getBase64ImageFromURL: it return Base64Url from image url
  const getBase64ImageFromURL = url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  };

  // const getImageDimensions = file => {
  //   return new Promise(resolved => {
  //     const i = new Image();
  //     i.onload = () => {
  //       resolved({ w: i.width, h: i.height });
  //     };
  //     i.src = file;
  //   });
  // };

  // generatePDF: genrates pdf using pdfmake
  const generatePDF = async () => {
    // Attendees
    // table header color
    const tableHeaderColor = '#585858';
    const attendList = [];
    attendList.push([
      {
        text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.NAME'),
        fillColor: tableHeaderColor,
        style: 'tableHeader',
      },
      {
        text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ROLE'),
        fillColor: tableHeaderColor,
        style: 'tableHeader',
      },
      {
        text: t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ORGANISATION',
        ),
        fillColor: tableHeaderColor,
        style: 'tableHeader',
      },
      {
        text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ATTENDED'),
        fillColor: tableHeaderColor,
        style: 'tableHeader',
      },
    ]);
    for (let i = 0; i < design.attendees.length; i += 1) {
      const attend = design.attendees[i];
      attendList.push([
        attend.name,
        attend.role,
        attend.organisation,
        attend.isAttended,
      ]);
    }

    // Notes and Comments : html to pdf conversion
    const notes = htmlToPdfmake(design.meetingNotes, {
      window,
      tableAutoSize: true,
    });

    // scheduledList: list of phases with  completion dates and comments
    const scheduledList = [];
    const listHeaderColor = '#d0cece';
    const listMainItemColor = '#acb9ca';
    scheduledList.push([
      {
        text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.PHASES'),
        fillColor: listHeaderColor,
      },
      {
        text: t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.BUDGETED_DATE',
        ),
        fillColor: listHeaderColor,
      },
      {
        text: t(
          'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.PLANNED_DATE',
        ),
        fillColor: listHeaderColor,
      },
      {
        text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.COMMENTS'),
        fillColor: listHeaderColor,
      },
    ]);
    for (let i = 0; i < design.phases.length; i += 1) {
      const scheuled = design.phases[i];
      scheduledList.push([
        { text: scheuled.phase, fillColor: listMainItemColor },
        { text: scheuled.budgetedDate, fillColor: listMainItemColor },
        { text: scheuled.plannedDate, fillColor: listMainItemColor },
        {
          stack: [
            [
              scheuled.comment.owner
                ? `[${t(
                    'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.OWNER',
                  )}]: ${scheuled.comment.owner}`
                : '',
            ],
            [
              scheuled.comment.tenant
                ? `[${t(
                    'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.TENANT',
                  )}]: ${scheuled.comment.tenant}`
                : '',
            ],
          ],
          fillColor: listMainItemColor,
        },
      ]);
      for (let j = 0; j < scheuled.actions.length; j += 1) {
        const action = scheuled.actions[j];
        scheduledList.push([
          { text: action.phase },
          { text: action.budgetedDate },
          { text: action.plannedDate },
          {
            stack: [
              [
                action.comment.owner
                  ? `[${t(
                      'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.OWNER',
                    )}]: ${action.comment.owner}`
                  : '',
              ],
              [
                action.comment.tenant
                  ? `[${t(
                      'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.TENANT',
                    )}]: ${action.comment.tenant}`
                  : '',
              ],
            ],
          },
        ]);
      }
    }

    // if property has header and footer images then set it here
    const headerUrl = await getBase64ImageFromURL(
      'https://test-accio.s3.me-south-1.amazonaws.com/other/Header.png',
    );

    // const dimensions = await getImageDimensions(headerUrl);
    // const headerUrl = '';
    // const footerUrl = await getBase64ImageFromURL(
    //   'https://test-accio.s3.me-south-1.amazonaws.com/other/Footer.png',
    // );
    const footerUrl = '';

    // docDefinition: as per pdfmake
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [contentGutterSize, 110, contentGutterSize, 65], // change margin if want to change header or footer height
      // content
      content: [
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*'],
            body: [
              [
                {
                  text: design.caseDetails.meeting,
                  style: 'tableHeader',
                  fillColor: tableHeaderColor,
                },
              ],
              [
                {
                  stack: [
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.DATE',
                      )} ${design.caseDetails.date}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.TIME',
                      )} ${design.caseDetails.time}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.PROPERTY',
                      )} ${design.caseDetails.property}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.CUSTOMER',
                      )} ${design.caseDetails.customer}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.BRAND',
                      )} DEBENHAMS`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.UNIT',
                      )} ${design.caseDetails.unit}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.FITOUT_PERIOD',
                      )} ${design.caseDetails.fitoutPeriod}`,
                    ],
                    [
                      `${t(
                        'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.CASE',
                      )}24`,
                    ],
                  ],
                },
              ],
            ],
          },
        },
        {
          text: t(
            'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ATTENDEES',
          ),
          style: 'header',
        },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: attendList,
          },
        },

        {
          text: t(
            'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.NOTES_AND_COMMENTS',
          ),
          style: 'header',
        },
        {
          table: {
            headerRows: 0,
            dontBreakRows: false,
            body: [[notes]],
          },
        },

        {
          text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.SCHEDULE'),
          style: 'header',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: scheduledList,
          },
        },

        {
          text: t('KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.SIGNED'),
          style: 'header',
        },
        {
          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: ['*', '*'],
            heights: [20, 150, 10],
            fontSize: 13,
            body: [
              [
                {
                  text: `${t(
                    'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ON_BEHALF',
                  )} ${design.caseDetails.onBehalfOf.owner.organisation}`,
                },
                {
                  text: `${t(
                    'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.ON_BEHALF',
                  )} ${design.caseDetails.onBehalfOf.tenant.organisation}`,
                },
              ],
              [
                { text: '', lineHeight: 20 },
                { text: '', lineHeight: 20 },
              ],
              [
                {
                  stack: [
                    [design.caseDetails.onBehalfOf.owner.name],
                    [design.caseDetails.onBehalfOf.owner.role],
                    [design.caseDetails.onBehalfOf.owner.organisation],
                  ],
                },
                {
                  stack: [
                    [design.caseDetails.onBehalfOf.tenant.name],
                    [design.caseDetails.onBehalfOf.tenant.role],
                    [design.caseDetails.onBehalfOf.tenant.organisation],
                  ],
                },
              ],
            ],
          },
          layout: {
            hLineWidth(i, node) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth(i, node) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i, node) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'white';
            },
            vLineColor() {
              return 'black';
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 13,
          margin: [0, 20, 20, 10],
        },
        headerText: {
          fontSize: 18,
          margin: [contentGutterSize, 40, 20, 0],
          bold: true,
          color: 'black',
        },
        footerText: {
          fontSize: 15,
          margin: [0, 20, 20, 20],
          bold: true,
          color: 'black',
        },
        box: {
          border: 'solid 1px black',
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
        },
      },
      defaultStyle: {
        fontSize: 10,
        font: 'Roboto',
        // font: 'Hindi',
        // font: 'Chinese',
      },
    };

    // set header
    if (headerUrl) {
      docDefinition.header = {
        image: headerUrl,
        height: 100, // 100px
        width: pageSize.width - 2 * gutterSize, // 515px
        margin: [gutterSize, 0, gutterSize, 0], // gutter space 40
      };
      // docDefinition.header = (currentPage, pageCount, sizeOfPage) => {
      //   // you can apply any logic and return any valid pdfmake element
      //   console.log('page size', sizeOfPage);
      //   return [
      //     {
      //       image: headerUrl,
      //       height: 100,
      //       width: sizeOfPage.width,
      //       margin: [0, 0, 0, 20],
      //     },
      //   ];
      // };
    } else {
      docDefinition.header = {
        text: design.header.text,
        alignment: 'left',
        style: 'headerText',
      };
    }
    // set footer
    if (footerUrl) {
      docDefinition.footer = {
        image: footerUrl,
        height: 100,
        width: pageSize.width - gutterSize,
        margin: [gutterSize / 2, 0, gutterSize / 2, 0],
      };
    } else {
      // docDefinition.footer = {
      //   text: design.footer,
      //   alignment: 'center',
      //   style: 'header',
      // };
      docDefinition.footer = (currentPage, pageCount) => {
        return {
          text: `${t(
            'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.PAGE',
          )} ${currentPage.toString()} ${t(
            'KICK_OFF.KICK_OFF_MEETING_AND_SIGN_OFF.STEP_4.PDF.OF',
          )} ${pageCount}`,
          alignment: 'center',
          style: 'footerText',
          margin: [0, 20, 50, 30],
        };
      };
    }
    // createPdf
    const pdfDocGenerator = PdfMake.createPdf(docDefinition);
    // getDataUrl: get url from generated pdf and set it to iframe
    pdfDocGenerator.getDataUrl(dataUrl => {
      const iframe = document.getElementById('preview-mom');
      iframe.setAttribute('style', 'display:block;');
      iframe.setAttribute('src', dataUrl);
    });
  };

  return (
    <div className="preview-mom-and-signoff">
      {/* iframe: for preview mom */}
      <iframe
        title="preview-mom"
        id="preview-mom"
        style={{ display: 'none' }}
        width="745px"
        // width={pageSize.width}
        height={pageSize.height}
      />
    </div>
  );
};

export default Step4;
