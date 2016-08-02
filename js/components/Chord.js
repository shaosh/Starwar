/**
 * Created by sshao on 8/2/2016.
 */

var React = require('react');
var ReactDom = require('react-dom');
var d3Chord = require('./d3Chord');

var Chord = React.createClass({
  propTypes: {
    matrix: React.PropTypes.array.isRequired,
    nameList: React.PropTypes.array.isRequired,
    outerRadius: React.PropTypes.number.isRequired
  },

  dispatcher: null,

  componentDidMount: function(){
    var el = ReactDom.findDOMNode(this.refs.chord);
    var dispatcher = d3Chord.create(el, {
      outerRadius: this.props.outerRadius,
      nameList: this.props.nameList,
      matrix: this.props.matrix
    });
    this.dispatcher = dispatcher;
  },

  render: function() {
    return (
      <div ref="chord" className="Chord"></div>
    );
  }
});

module.exports = Chord;