/**
 * Created by sshao on 6/2/2016.
 */
var keyMirror = require('keymirror');

var Actions = keyMirror({
  GET_DATA: null,
  CLEAR_DATA: null,
  SUCCESS_GET_DATA: null,
  ERROR_GET_DATA: null
});

var Store = keyMirror({
  DISPLAY_DATA: null,
  CLEAR_DATA: null,
  GET_DATA_REQUEST_COMPLETE: null,
  ERROR: null
});

var Errors = keyMirror({
  SYNTAX_ERROR_REQUEST: null,
  FAIL_TO_CONNECT: null
});

var Urls = {
  SWAPI: 'http://graphql-swapi.parseapp.com/',
  SWAPI_PROXY: 'http://localhost:3000/swapiProxy/'
};

var Queries = {
  CHARACTER: `{
    allFilms {
      films {
        id
        episodeID
        title
        characterConnection {
          characters {
            name
            id
            homeworld{
              name
            }
            species{
              name
              personConnection{
                people{
                  name
                  id
                }
              }
            }
            starshipConnection{
              starships{
                id
                name
              }
            }
            filmConnection{
              films{
                id
                title
              }
            }
            vehicleConnection{
              vehicles{
                id
                name
              }
            }
          }
        }
      }
    }
  }`
};

module.exports = {
  Actions: Actions,
  Urls: Urls,
  Store: Store,
  Queries: Queries,
  Errors: Errors
};
