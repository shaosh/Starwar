/**
 * Created by sshao on 6/2/2016.
 */

var React = require('react');
var _ = require('underscore');
var CharacterList = require('./CharacterList');
var ResultArea = require('./ResultArea');
var StarwarStore = require('../stores/StarwarStore');
var StarwarConstants = require('../constants/StarwarConstants');
var StarwarActions = require('../actions/StarwarActions');

const LIST1 = 'list1';
const LIST2 = 'list2';

var character1 = '';
var character2 = '';
var characterFilmMapping = {};

var Container = React.createClass({
  getInitialState: function(){
    return {
      characters: [],
      character1: '',
      charcater2: '',
      error: '',
      episodes: [],
      resultAreaText: ''
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
    StarwarActions.getStarwarData();
  },

  onDisplayData: function(){
    var result = StarwarStore.getData();
    this.fulfillCharacterFilmMapping(result);
  },

  fulfillCharacterFilmMapping: function(result){
    if(result && result.allFilms && result.allFilms.films){
      var films = result.allFilms.films;
      for(var i = 0; i < films.length; i++){
        var film = films[i];
        if(film && film.characterConnection && film.characterConnection.characters){
          var characters = film.characterConnection.characters;
          for(var j = 0; j < characters.length; j++){
            var character = characters[j];
            var name = character.name;
            var filmConnection =  character.filmConnection;
            if(name && !characterFilmMapping[name] && filmConnection){
              characterFilmMapping[name] = filmConnection.films;
            }
          }
        }
      }
      if(Object.keys(characterFilmMapping).length){
        var characterList = Object.keys(characterFilmMapping);
        this.setState({characters: characterList, character1: characterList[0], character2: characterList[0]});
      }
    }
  },

  onDisplayError: function(){
    this.setState({error: StarwarStore.getError()});
  },

  setCharacter: function(name, listid){
    if(name){
      if(listid === LIST1){
        character1 = name;
      }
      else if(listid === LIST2){
        character2 = name;
      }
    }
  },

  findFilmsInCommon: function(){
    if(character1 === character2){
      this.setState({ episodes:[], resultAreaText:'Please choose different characters.'});
      return;
    }
    if(!character1 || !character2){
      this.setState({episodes:[], resultAreaText:'Please select characters.'});
      return;
    }
    if(Object.keys(characterFilmMapping).length === 0){
      StarwarActions.getStarwarData();
      //TODO: differentiat componentDidMount and findFilmsBothCharactersAppear
    }
    var data = StarwarStore.getData();
    var filmsList1 = characterFilmMapping[character1];
    var filmsList2 = characterFilmMapping[character2];
    var filmsIds1 = _.pluck(filmsList1, 'id');
    var filmsIds2 = _.pluck(filmsList2, 'id');
    var filmsInCommon = _.intersection(filmsIds1, filmsIds2);
    var episodes = [];
    for(var i = 0; i < filmsInCommon.length; i++){
      var film = this.findFilmById(filmsInCommon[i], data);
      if(film){
        episodes.push(film);
      }
    }
    var text = episodes.length ? '' : 'No films in common';
    this.setState({episodes: episodes, resultAreaText: text, character1: character1, character2: character2});
  },

  findFilmById: function(id, data){
    if(data && data.allFilms && data.allFilms.films){
      var films = data.allFilms.films;
      for(var i = 0; i < films.length; i++){
        if(films[i].id === id){
          return {title: films[i].title, episodeID: films[i].episodeID};
        }
      }
    }
    return null;
  },

  render: function(){
    var {characters, error, character1, character2, episodes, resultAreaText} = this.state;
    return (
      <div id="starwarContainer" value="">
        <div><p>{error}</p></div>
        <CharacterList id={LIST1} setCharacter={this.setCharacter} characters={characters}></CharacterList>
        <CharacterList id={LIST2} setCharacter={this.setCharacter} characters={characters}></CharacterList>
        <button onClick={this.findFilmsInCommon}>Find Common Episode</button>
        <ResultArea character1={character1} character2={character2} episodes={episodes} resultAreaText={resultAreaText}></ResultArea>
      </div>
    );
  }
});

module.exports = Container;