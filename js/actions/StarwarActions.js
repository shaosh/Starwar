/**
 * Created by sshao on 6/2/2016.
 */
"use strict";

var Dispatcher = require('../dispatcher/Dispatcher');
var StarwarConstants = require('../constants/StarwarConstants');
var StarwarService = require('../services/StarwarService.js');

var getStarwarDataCallback = function(err, result){
  if(err){
    StarwarActions.errorGetData(err);
  }
  else{
    StarwarActions.successGetData(result);
  }
};

var StarwarActions = {
  errorGetData: function(err){
    var logData = [];
    if(err){
      logData.push(['ErrorString', err]);
    }
    Dispatcher.dispatch({
      actionType: StarwarConstants.Actions.ERROR_GET_DATA,
      httpResponse: err,
      logData: logData
    });
  },

  successGetData: function(result){
    var logData = [];
    if(result){
      logData.push(['Results', result]);
    }
    Dispatcher.dispatch({
      actionType: StarwarConstants.Actions.SUCCESS_GET_DATA,
      result: result,
      logData: logData
    });
  },

  getStarwarData: function(query) {
    StarwarService.getData(getStarwarDataCallback, query);

    Dispatcher.dispatch({
      actionType: StarwarConstants.Actions.GET_DATA,
      logData: [['Query', query]]
    });
  }
};

module.exports = StarwarActions;
