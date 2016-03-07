import { NativeMethodsDecorator } from '../../modules/NativeMethodsMixin'
import React, {Component} from 'react'
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

  constructor(props) {
    super(props)
    this.state = {
      curRenderedRowsCount: this.props.initialListSize,
      highlightedRow: {}
    }
  }

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

    // render header
    if (this.props.renderHeader) {
      children.push(this.props.renderHeader())
    }

    // render sections and rows
    const sections = dataSource.rowIdentities
    const renderRow = this.props.renderRow
    const renderSectionHeader = this.props.renderSectionHeader
    const renderSeparator = this.props.renderSeparator
    for (let sectionIdx = 0, sectionCnt = sections.length; sectionIdx < sectionCnt; sectionIdx++) {
      const rows = sections[sectionIdx]
      const sectionId = dataSource.sectionIdentities[sectionIdx]

      // render optional section header
      if (renderSectionHeader) {
        const section = dataSource.getSectionHeaderData(sectionIdx)
        const key = 's_' + sectionId
        const child = <div key={key}>{renderSectionHeader(section, sectionId)}</div>
        children.push(child)
      }

      // render rows
      for (let rowIdx = 0, rowCnt = rows.length; rowIdx < rowCnt; rowIdx++) {
        const rowId = rows[rowIdx]
        const row = dataSource.getRowData(sectionIdx, rowIdx)
        const key = 'r_' + sectionId + '_' + rowId
        const child = <div key={key}>{renderRow(row, sectionId, rowId, this.onRowHighlighted)}</div>
        children.push(child)

        // render optional separator
        if (renderSeparator && ((rowIdx !== rows.length - 1) || (sectionIdx === sections.length - 1))) {
          const adjacentRowHighlighted =
            this.state.highlightedRow.sectionID === sectionId && (
              this.state.highlightedRow.rowID === rowId ||
              this.state.highlightedRow.rowID === rows[rowIdx + 1])
          const separator = renderSeparator(sectionId, rowId, adjacentRowHighlighted)
          children.push(separator)
        }
      }
    }

    // render footer
    if (this.props.renderFooter) {
      children.push(this.props.renderFooter())
    }

    return (
      <ScrollView >
        {children}
      </ScrollView>
    )
  }
}
