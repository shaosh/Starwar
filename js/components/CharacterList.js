/**
 * Created by sshao on 6/9/2016.
 */

var React = require('react');

var CharacterList = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    setCharacter: React.PropTypes.func.isRequired,
    characters: React.PropTypes.array
  },

  onChange: function(){
    var {id} = this.props;
    var characterList = document.getElementById(id);
    if(characterList){
      this.props.setCharacter(characterList.value, id);
    }
  },

  render: function(){
    var {characters, id} = this.props;
    var options = '';
    if(characters && characters.length) {
      options = characters.map(function(character) {
        return (
          <option value = {character}>{character}</option>
        );
      });
    }

    if(options.length){
      return(
        <select id={id} onChange={this.onChange}>
          {options}
        </select>
      );
    }
    else{
      return(<p></p>);
    }
  }
});

module.exports = CharacterList;