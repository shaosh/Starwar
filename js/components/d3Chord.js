/**
 * Created by sshao on 8/2/2016.
 */

var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

var ns = {};

ns.svg = null;

ns.create = function(el, props, state){
  var outerRadius = props.outerRadius;
  var innerRadius = outerRadius - 130;

  var fill = d3.scale.category20c();

  var chord = d3.layout.chord()
    .padding(.01)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 20);

  this.svg = d3.select(el).append("svg")
    .attr("width", outerRadius * 2)
    .attr("height", outerRadius * 2)
    .append("g")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
  this._loadData(chord, this.svg, arc, innerRadius, fill, props.matrix, props.nameList);

  var dispatcher = new EventEmitter();
  //this.update(el, state, dispatcher);

  return dispatcher;
};

ns.update = function(el, state, dispatcher){
  if(state.source > -1 && state.target > -1){
    this.highlightChord(state.source, state.target, this.svg);
  }
};

ns.removeNameOfEmptyGroup = function(matrix, nameList){
  var newList = [];
  for(var i = 0; i < matrix.length; i++){
    var sum = 0;
    for(var key in matrix[i]){
      sum = sum + matrix[i][key];
    }
    if(sum === 0){
      newList[i] = '';
    }
    else{
      newList[i] = nameList[i];
    }
  }
  return newList;
};

ns._loadData = function(chord, svg, arc, innerRadius, fill, matrix, nameList){
  chord.matrix(matrix);
  nameList = this.removeNameOfEmptyGroup(matrix, nameList);
  var that = this;

  var g = svg.selectAll(".group")
    .data(chord.groups)
    .enter().append("g")
    .attr("class", "group")
    .on('mouseover', function(d, i){
      that.fade(.01, i, svg);
      that.showGroup(1, d.index, svg);
    })
    .on('mouseout', function(d, i){
      that.fade(1, i, svg)
    });

  g.append("path")
    .style("fill", function(d) { return fill(d.index); })
    .style("stroke", function(d) { return fill(d.index); })
    .attr("d", arc);

  g.append("text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        + "translate(" + (innerRadius + 26) + ")"
        + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return nameList[d.index]; });

  svg.selectAll(".chord")
    .data(chord.chords)
    .enter().append("path")
    .attr("class", "chord")
    .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
    .style("fill", function(d) { return fill(d.source.index); })
    .attr("d", d3.svg.chord().radius(innerRadius))
    .on("mouseover", function(d, i){
      that.fade(.01, i, svg);
      var currentEl = d3.select(this);
      currentEl.style("opacity", 1);
    })
    .on("mouseout", function(d, i){
      that.fade(1, i, svg)
    });
};

ns.highlightChord = function(source, target, svg){
  this.fade(.01, -1, svg);
  svg.selectAll("path.chord")
    .filter(function(d, i) {
      return d.source.index === source && d.target.index === target;
    })
    .transition()
    .style("opacity", 1);
};

ns.fade = function(opacity, i, svg) {
  svg.selectAll("path.chord")
    .filter(function(d) {
      return d.source.index != i && d.target.index != i;
    })
    .transition()
    .style("opacity", opacity);
};

ns.showGroup = function(opacity, i, svg){
  svg.selectAll("path.chord")
    .filter(function(d){
      return d.source.index === i;
    })
    .transition()
    .style("opacity", opacity);
};

ns.destroy = function(el) {

};

module.exports = ns;