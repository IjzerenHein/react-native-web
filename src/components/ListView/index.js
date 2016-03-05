import { NativeMethodsDecorator } from '../../modules/NativeMethodsMixin'
import React, { Component } from 'react'
import ScrollView from '../ScrollView'
import ListViewDataSource from './ListViewDataSource'
import ListViewPropTypes from './ListViewPropTypes'

@NativeMethodsDecorator
export default class ListView extends Component {
  static DataSource = ListViewDataSource;
  static propTypes = ListViewPropTypes;
  static defaultProps = {
    initialListSize: 10,
    pageSize: 1,
    renderScrollComponent: props => <ScrollView {...props} />,
    scrollRenderAheadDistance: 1000,
    onEndReachedThreshold: 1000,
    stickyHeaderIndices: []
  };

  getScrollResponder() {
    // TODO ?
  }

  scrollTo(...args) {
    // TODO ?
  }

  setNativeProps(props) {
    // TODO ?
  }

  onRowHighlighted(sectionID, rowID) {
    this.setState({highlightedRow: {sectionID, rowID}})
  }

  render() {
    const dataSource = this.props.dataSource
    // console.log('whoop')
    const children = []
    const sections = dataSource.rowIdentities
    const renderRow = this.props.renderRow
    for (let sectionIdx = 0, sectionCnt = sections.length; sectionIdx < sectionCnt; sectionIdx++) {
      const rows = sections[sectionIdx]
      const sectionId = dataSource.sectionIdentities[sectionIdx]
      for (let rowIdx = 0, rowCnt = rows.length; rowIdx < rowCnt; rowIdx++) {
        const row = dataSource.getRowData(sectionIdx, rowIdx)
        const key = sectionId + ':' + rowIdx
        const child = <div key={key}>{renderRow(row)}</div>
        children.push(child)
      }
    }
    return (
      <ScrollView >
        {children}
      </ScrollView>
    )
  }
}
