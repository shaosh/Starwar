/**
 * Created by sshao on 6/2/2016.
 */

var React = require('react');
var CharacterList = require('./CharacterList');
var StarwarStore = require('../stores/StarwarStore');
var StarwarConstants = require('../constants/StarwarConstants');
var StarwarActions = require('../actions/StarwarActions');

const LIST1 = 'list1';
const LIST2 = 'list2';

var Container = React.createClass({
  getInitialState: function(){
    return {
      characters: [],
      character1: '',
      charcater2: '',
      error: ''
    };
  },

  componentWillMount: function(){
    StarwarStore.addChangeListener(this.onDisplayData, StarwarConstants.Store.DISPLAY_DATA);
    StarwarStore.addChangeListener(this.onDisplayError, StarwarConstants.Store.SYNTAX_ERROR_REQUEST);
    StarwarStore.addChangeListener(this.onDisplayError, StarwarConstants.Store.FAIL_TO_CONNECT);
  },

  componentWillUnmount: function() {
    StarwarStore.removeChangeListener(this.onDisplayData, StarwarConstants.Store.DISPLAY_DATA);
    StarwarStore.removeChangeListener(this.onDisplayError, StarwarConstants.Store.SYNTAX_ERROR_REQUEST);
    StarwarStore.removeChangeListener(this.onDisplayError, StarwarConstants.Store.FAIL_TO_CONNECT);
  },

  componentDidMount: function(){
    StarwarActions.getStarwarData(StarwarConstants.Queries.CHARACTER);
  },

  onDisplayData: function(){
    var result = StarwarStore.getData();
    if(result && result.allFilms && result.allFilms.films){
      var films = result.allFilms.films;
      var cHash = {};
      for(var i = 0; i < films.length; i++){
        var film = films[i];
        if(film && film.characterConnection && film.characterConnection.characters){
          var characters = film.characterConnection.characters;
          for(var j = 0; j < characters.length; j++){
            var character = characters[j];
            var name = character.name;
            if(name && !cHash[name]){
              cHash[name] = true;
            }
          }
        }
      }
      if(Object.keys(cHash).length){
        this.setState({characters: Object.keys(cHash)});
      }
    }
  },

  onDisplayError: function(){
    this.setState({error: StarwarStore.getError()});
  },

  setCharacter: function(name, listid){
    if(name){
      if(listid === LIST1){
        this.setState({character1: name});
      }
      else if(listid === LIST2){
        this.setState({character2: name});
      }
    }
  },

  render: function(){
    var {characters, error} = this.state;
    return (
      <div id="starwarContainer" value="">
        <div><p>{error}</p></div>
        <CharacterList id={LIST1} setCharacter={this.setCharacter} characters={characters}></CharacterList>
        <CharacterList id={LIST2} setCharacter={this.setCharacter} characters={characters}></CharacterList>
      </div>
    );
  }
});

module.exports = Container;