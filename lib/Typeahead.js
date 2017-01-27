var React = require('react');
var ReactDOM = require('react-dom');

/*
 * Inspired by: https://github.com/priteshgupta/React-Typeahead
 */
var Typeahead = React.createClass({

  propTypes: {
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
    changeFunc: React.PropTypes.func,
    array: React.PropTypes.array,
    autoFocus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      index: -1,
      selected: this.props.selected,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({ value: nextProps.value || '',
                    selected: nextProps.selected,
                    index: -1});
  },

  handleClick: function(e) {
    this.props.changeFunc(e.target.innerHTML);
    this.setState({value: e.target.innerHTML, selected: true});
  },

  handleChange: function(e) {
    //this.setState({value: e.target.value, selected: false, index: 0});
    this.props.changeFunc(e.target.value);
    this.setState({selected:false,index:0});
  },

  selectItem: function(e) {
    if (this.state.selected) return;

    var item = this.items[this.state.index];
    if (!Boolean(item)) item = this.items[0];

    if (e.keyCode === 40 && this.state.index < this.items.length - 1) {
      this.setState({index: ++this.state.index});
    }
    else if (e.keyCode === 38 && this.state.index > 0) {
      this.setState({index: --this.state.index});
    }
    else if (e.keyCode === 13) {
      this.setState({value:item.key, selected: true, index: 0});
      this.props.changeFunc(item.key);
    }

  },

  handleFocus: function(e) {
    this.setState({selected: this.props.selected});
  },

  handleBlur: function(e) {
    var idx = this.props.array.map( e => e.toLowerCase()).indexOf(this.state.value);
    if(idx > -1) {
      var element = this.props.array[idx];
      this.setState({selected: true, value: element});
      this.props.changeFunc(element);
    } else {
      return false;
    }
  },

  render: function() {
    this.items = [];

    var searchResult = this.state.selected || (
      <div className="search-results">
        {this.items}
      </div>
    );


    this.state.selected || this.props.array.filter( el => {
      el = el.toLowerCase();

      var val = this.state.value.toLowerCase();

      return el.indexOf(val) > -1 || el.replace('-', ' ').indexOf(val) > -1;
    }).forEach( (el, idx) => {
      if (!this.state.value && idx  > 2) return;
      var className = this.state.index === idx  ?
                  'list-group-item active-list' :
                  'list-group-item';

      this.items.push(<a style={{display:"block",cursor: "pointer"}}
          key={el} className={className}
          onClick={this.handleClick}>{el}</a>);
    });

    var extraProps = {}
    if(this.props.autoFocus){
      extraProps = {autoFocus: true}
    }

    return (
      <div className="search-wrapper">
        <input type="text" id={this.props.id} required
                className="form-control" value={this.state.value}
                placeholder={this.props.placeholder}
                { ...extraProps }
                onChange={this.handleChange} onKeyDown={this.selectItem}
                onFocus={this.handleFocus} onBlur={this.handleBlur} />
        {searchResult}
      </div>
    );
  }

});

module.exports = Typeahead;
