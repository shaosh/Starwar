/**
 * Created by sshao on 6/2/2016.
 */
"use strict";

require('../utils/StringHelper');

var StarwarConstants = require('../constants/StarwarConstants');

var request = require('request');

var StarwarService = {
  getData: (callback) => {
    request.get({url: StarwarConstants.Urls.SWAPI_PROXY}, function(err, res, body){
      if(err){
        callback(err, null);
      }
      else if(res.statusCode === 200){
        callback(null, body);
      }
      else{
        callback(res.statusCode, null);
      }
    });
  }
};

module.exports = StarwarService;