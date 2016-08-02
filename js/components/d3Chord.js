/**
 * Created by sshao on 8/2/2016.
 */

var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

var ns = {};

ns.create = function(el, props){
  var outerRadius = props.outerRadius;
  var innerRadius = outerRadius - 75;

  var fill = d3.scale.category20c();

  var chord = d3.layout.chord()
    .padding(.01)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 16);

  var svg = d3.select(el).append("svg")
    .attr("width", outerRadius * 2)
    .attr("height", outerRadius * 2)
    .append("g")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
  this._loadData(chord, svg, arc, innerRadius, fill, props.matrix, props.nameList);

  //var dispatcher = new EventEmitter();
  //this.update(el, state, dispatcher);
  //
  //return dispatcher;
};

ns.update = function(el, state, dispatcher){

};

ns._scales = function(el, domain){

};

ns._loadData = function(chord, svg, arc, innerRadius, fill, matrix, nameList){
  chord.matrix(matrix);
  var g = svg.selectAll(".group")
    .data(chord.groups)
    .enter().append("g")
    .attr("class", "group");

  g.append("path")
    .style("fill", function(d) { return fill(d.index); })
    .style("stroke", function(d) { return fill(d.index); })
    .attr("d", arc);

  g.append("text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        + "translate(" + (innerRadius + 15) + ")"
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
    .attr("d", d3.svg.chord().radius(innerRadius));
};

ns.destroy = function(el) {

};

module.exports = ns;