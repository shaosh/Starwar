/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var StarwarConstants = require('../constants/StarwarConstants');
var assign = require('object-assign');

var characterList = [];
var data;
var error;

var StarwarStore = assign({}, EventEmitter.prototype, {

  getData: function(){
    return data;
  },

  getError: function(){
    return error;
  },

  getCharacters: function(){
    return characterList;
  },

  emitChange: function(event) {
    this.emit(event);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback, event) {
    this.on(event, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback, event) {
    this.removeListener(event, callback);
  }
});

// Register callback to handle all updates
Dispatcher.register(function(action) {
  switch(action.actionType) {
    case StarwarConstants.Actions.SUCCESS_GET_DATA:
      var result = action.result;
      if(result && result.data){
        data = result.data;
        StarwarStore.emitChange(StarwarConstants.Store.DISPLAY_DATA);
      }
      else{
        data = '';
        StarwarStore.emitChange(StarwarConstants.Store.DISPLAY_DATA);
      }
      break;
    case StarwarConstants.Actions.ERROR_GET_DATA:
      var res = action.httpResponse;
      if(res.errors){
        error = StarwarConstants.Errors.SYNTAX_ERROR_REQUEST;
        data = '';
        StarwarStore.emitChange(StarwarConstants.Store.ERROR);
      }
      else{
        error = StarwarConstants.Errors.FAIL_TO_CONNECT;
        data = '';
        StarwarStore.emitChange(StarwarConstants.Store.ERROR);
      }
      break;
    default:
      // no op
  }
});

module.exports = StarwarStore;
