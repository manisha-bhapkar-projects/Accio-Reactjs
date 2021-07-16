// import React, { Component } from 'react';
// import {
//   SortableContainer,
//   SortableElement,
//   arrayMove,
// } from 'react-sortable-hoc';
// // import CardHeader from '../../components/CardHeader/CardHeader';

// const SortableItem = SortableElement(({ value }) => {
//   // value is all array index values
//   console.log('SortableItem', value);
//   // design component here pass subcomponent
//   return (
//     <li
//       onClick={() => {
//         handleClick(value);
//       }}
//     >
//       {value}
//     </li>
//   );
// });
// // pass Array of object , main content
// const SortableList = SortableContainer(({ items }) => {
//   // item is Array of values
//   console.log('SortableList items', items);
//   return (
//     <ul>
//       {items.map((value, index) => (
//         <SortableItem key={`item-${index}`} index={index} value={value} /> // sorting data
//       ))}
//     </ul>
//   );
// });

// function handleClick(value) {
//   console.log('handleClick value===', value);
//   alert(`value=${value}`);
// }

// class SetupAndDesign extends Component {
//   state = {
//     items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
//   };

//   onSortEnd = ({ oldIndex, newIndex }) => {
//     console.log('onSortEnd', this.state.items, oldIndex, newIndex);
//     this.setState({
//       items: arrayMove(this.state.items, oldIndex, newIndex),
//     });
//   };

//   render() {
//     return (
//       <>
//         <SortableList
//           items={this.state.items}
//           onSortEnd={this.onSortEnd}
//           // distance={5}
//           lockAxis="xy"
//         />
//       </>
//     );
//   }
// }

// export default SetupAndDesign;

// // ==================================================================================

// // const SortableItem = SortableElement(
// //   ({ field}) => {
// //     return (
// //       <Cell >
// //         {field}
// //       </Cell>
// //     );
// //   },
// // );

// // const SortableList = SortableContainer(
// //   ({

// //     data,

// //     headerHeight,
// //     columnOrder,
// //     mapDataToCellComponentName,
// //     columnWidth,
// //   }) => {
// //     return (
// //       <Table

// //         rowsCount={data.length}

// //       >
// //         {columnOrder.map((field, index) => {
// //           let CellComponent;
// //           let widthCell;
// //           const passedData = data;
// //           if (mapDataToCellComponentName === undefined) {
// //             CellComponent = props => {
// //               const ownProps = { style: null, data: passedData, col: field };
// //               const finalProps = { ...props, ...ownProps };
// //               return <TextCell {...finalProps} />; // TextCell is a cell that is imported
// //             };
// //           } else {
// //             const [
// //               component,
// //               decimalPlaces,
// //               width,
// //             ] = mapDataToCellComponentName(field, index);
// //             widthCell = width;
// //             CellComponent = createDynamicComponentForCells(component, {
// //               style: null,
// //               data: passedData,
// //               col: field,
// //               decimals: decimalPlaces,
// //             }); //  This function returns a component
// //           }
// //           return (
// //             <Column // Can't wrap this since Table requires child to be of type Column
// //               key={`columnF-${index}`}
// //               style={null}
// //               cell={props => CellComponent(props)}
// //               header={
// //                 <SortableItem // 2nd attempt by wrapping header cell
// //                   key={`item-${index}`}
// //                   index={index}
// //                   field={field}
// //                   widthCell={widthCell}
// //                   columnWidth={columnWidth}
// //                   height={headerHeight}
// //                 />
// //               }
// //               width={widthCell !== undefined ? widthCell : columnWidth}
// //             />
// //           );
// //         })}
// //       </Table>
// //     );
// //   },
// // );

// // class TableComp extends React.Component {
// //   render() {
// //     return (
// //       <SortableList
// //         heightFactor={this.props.heightFactor}
// //         widthFactor={this.props.widthFactor}
// //         data={this.props.data}
// //         rowHeight={this.props.rowHeight}
// //         headerHeight={this.props.headerHeight}
// //         columnOrder={this.props.columnOrder}
// //         mapDataToCellComponentName={this.props.mapDataToCellComponentName}
// //         columnWidth={this.props.columnWidth}
// //         onSortEnd={this.props.onSortEnd} // This will always make newIndex either 0 or 10 after dropping.
// //         distance={1}
// //         helperClass="SortableHelper"
// //       />
// //     );
// //   }
// // }
