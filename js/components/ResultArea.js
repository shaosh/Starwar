/**
 * Created by sshao on 8/1/2016.
 */

var React = require('react');

var ResultArea = React.createClass({
  propTypes: {
    character1: React.PropTypes.string,
    character2: React.PropTypes.string,
    episodes: React.PropTypes.array,
    resultAreaText: React.PropTypes.string
  },

  shouldComponentUpdate: function(nextProps){
    return JSON.stringify(this.props.episodes) !== JSON.stringify(nextProps.episodes) || this.props.resultAreaText !== nextProps.resultAreaText;
  },

  render: function(){
    var {character1, character2, episodes, resultAreaText} = this.props;
    var lis = '';
    if(resultAreaText){
      return(<div className="info">{resultAreaText}</div>);
    }
    if(episodes && episodes.length) {
      lis = episodes.map(function(episode) {
        return (
          <li>Star War - {episode.title} (Episode {episode.episodeID})</li>
        );
      });
    }

    if(lis.length){
      var films = lis.length === 1 ? '1 film' : lis.length + ' films';
      return(
        <div id="result">
          <p>{character1} and {character2} both appear in {films}: </p>
          <ul>
            {lis}
          </ul>
        </div>
      );
    }
    else{
      return(<div></div>);
    }
  }
});

module.exports = ResultArea;