import React, { Component, PropTypes } from 'react'

export default class Typeahead extends Component {

  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      index: -1,
      selected: props.selected
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState(
      {
        value: nextProps.value || '',
        selected: nextProps.selected,
        index: -1
      }
    )
  }

  handleClick (e) {
    this.props.changeFunc(e.target.innerHTML)
    this.setState(
      {
        value: e.target.innerHTML,
        selected: true
      }
    )
  }

  handleChange (e) {
    this.props.changeFunc(e.target.value)
    this.setState(
      {
        index: 0,
        selected: false
      }
    )
  }

  selectItem (e) {
    if (this.state.selected) {
      return
    }

    let item = this.items[this.state.index]
    if (!Boolean(item)) {
      item = this.items[0]
    }

    if (e.keyCode === 40 && this.state.index < this.items.length - 1) {
      this.setState({index: ++this.state.index})
    } else if (e.keyCode === 38 && this.state.index > 0) {
      this.setState({index: --this.state.index})
    } else if (e.keyCode === 13) {
      this.setState({value:item.key, selected: true, index: 0})
      this.props.changeFunc(item.key)
    }
  }

  handleFocus (e) {
    this.setState(
      {
        selected: this.props.selected
      }
    )
  }

  handleBlur (e) {
    let idx = this.props.array.map( e => e.toLowerCase()).indexOf(this.state.value)
    if (idx > -1) {
      let element = this.props.array[idx]
      this.setState({selected: true, value: element})
      this.props.changeFunc(element)
    } else {
      return false
    }
  }

  render () {
    this.items = []

    let searchResult = this.state.selected || (
      <div className="search-results">
        { this.items }
      </div>
    )

    this.state.selected || this.props.array.filter( el => {
      el = el.toLowerCase()

      let val = this.state.value.toLowerCase()

      return el.indexOf(val) > -1 || el.replace('-', ' ').indexOf(val) > -1
    }).forEach( (el, idx) => {
      if (!this.state.value && idx  > 2) return
      let className = this.state.index === idx
        ? 'list-group-item active-list'
        : 'list-group-item'

      this.items.push(
        <a
          style={{display:"block",cursor: "pointer"}}
          key={ el } className={ className }
          onClick={ this.handleClick }
        >
          { el }
        </a>
      )
    })

    let extraProps = {}
    if (this.props.autoFocus) {
      extraProps = { autoFocus: true }
    }

    return (
      <div className="search-wrapper">
        <input
          type="text"
          id={ this.props.id }
          required
          autoFocus={ this.props.autoFocus }
          className="form-control"
          value={ this.state.value }
          placeholder={ this.props.placeholder }
          { ...extraProps }
          onChange={ this.handleChange }
          onKeyDown={ this.selectItem }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur } />
        { searchResult }
      </div>
    )
  }

}

Typeahead.propTypes = {
  value: PropTypes.string,
  selected: PropTypes.bool,
  changeFunc: PropTypes.func,
  array: PropTypes.array,
  autoFocus: PropTypes.bool
}