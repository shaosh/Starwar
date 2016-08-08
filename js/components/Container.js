/**
 * Created by sshao on 6/2/2016.
 */

var React = require('react');
var _ = require('underscore');
var CharacterList = require('./CharacterList');
var Chord = require('./Chord');
var ResultArea = require('./ResultArea');
var StarwarStore = require('../stores/StarwarStore');
var StarwarConstants = require('../constants/StarwarConstants');
var StarwarActions = require('../actions/StarwarActions');

const LIST1 = 'list1';
const LIST2 = 'list2';
const CHORD_RADIUS = 480;

var character1 = '';
var character2 = '';
var characterFilmMapping = {};
var indexByCharacter = {};
var characterList = [];
var coplayMapping = {};
var coplayMatrix = [];

var Container = React.createClass({
  getInitialState: function(){
    return {
      characters: [],
      character1: '',
      charcater2: '',
      error: '',
      episodes: [],
      resultAreaText: '',
      coplayMatrix: []
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
    this.generateCoplayMapping();
    this.generateMatrix();
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
        characterList = Object.keys(characterFilmMapping).sort();
        this.setState({characters: characterList});
        character1 = characterList[0];
        character2 = characterList[0];
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

  generateCoplayMapping: function(){
    if(!Object.keys(characterFilmMapping).length){
      return null;
    }
    if(!characterList.length){
      characterList = Object.keys(characterFilmMapping).sort();
    }
    for(var i = 0; i < characterList.length; i++){
      var obj = {};
      var character1 = characterList[i];
      indexByCharacter[character1] = i;
      for(var j = 0; j < characterList.length; j++){
        var character2 = characterList[j];
        if(i === j){
          obj[character2] = 0;
          continue;
        }
        var coplay = this.findCoplayFilms(character1, character2);
        obj[character2] = coplay.length < 3 ? 0 : coplay.length;
      }
      coplayMapping[character1] = obj;
    }
    return coplayMapping;
  },

  generateMatrix: function(){
    if(!Object.keys(coplayMapping).length || !Object.keys(characterFilmMapping).length){
      return null;
    }
    if(!characterList.length){
      characterList = Object.keys(characterFilmMapping).sort();
    }
    for(var i = 0; i < characterList.length; i++){
      var character1 = characterList[i];
      var obj = coplayMapping[character1];
      var array = [];
      for(var j = 0; j < characterList.length; j++){
        var character2 = characterList[j];
        array.push(obj[character2]);
      }
      coplayMatrix.push(array);
    }
    this.setState({coplayMatrix: coplayMatrix});
    return coplayMatrix;
  },

  onClick: function(){
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
    var filmsCoplay = this.findCoplayFilms(character1, character2);
    var episodes = [];
    for(var i = 0; i < filmsCoplay.length; i++){
      var film = this.findFilmById(filmsCoplay[i], data);
      if(film){
        episodes.push(film);
      }
    }
    var text = episodes.length ? '' : 'No films in common';
    this.setState({episodes: episodes, resultAreaText: text, character1: character1, character2: character2});
  },

  findCoplayFilms: function(character1, character2){
    var filmsList1 = characterFilmMapping[character1];
    var filmsList2 = characterFilmMapping[character2];
    var filmsIds1 = _.pluck(filmsList1, 'id');
    var filmsIds2 = _.pluck(filmsList2, 'id');
    var filmsCoplay = _.intersection(filmsIds1, filmsIds2);
    return filmsCoplay;
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
    var {characters, error, character1, character2, episodes, resultAreaText, coplayMatrix} = this.state;
    var chordState = {
      source: character1 ? indexByCharacter[character1] : -1,
      target: character2 ? indexByCharacter[character2] : -1
    };
    var chord = coplayMatrix.length && characterList.length ? (<Chord matrix={coplayMatrix} nameList={characterList} outerRadius={CHORD_RADIUS} appState={chordState}></Chord>) : (<div></div>);
    return (
      <div id="starwarContainer" value="">
        <div className="info"><p>{error}</p></div>
        <CharacterList id={LIST1} setCharacter={this.setCharacter} characters={characters}></CharacterList>
        <CharacterList id={LIST2} setCharacter={this.setCharacter} characters={characters}></CharacterList>
        <button onClick={this.onClick}>Find Common Episode</button>
        <ResultArea character1={character1} character2={character2} episodes={episodes} resultAreaText={resultAreaText}></ResultArea>
        {chord}
      </div>
    );
  }
});

module.exports = Container;