/**
 * Created by sshao on 6/2/2016.
 */
"use strict";

require('../utils/StringHelper');

var StarwarConstants = require('../constants/StarwarConstants');
var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;
var client = new Lokka({
  transport: new Transport(StarwarConstants.Urls.SWAPI)
});

var request = require('request');

var StarwarService = {
  getData: (callback, query) => {
    var vars = null;
    var data = client.cache.getItemPayload(query, vars);
    if(!data){
      var url = StarwarConstants.Urls.SWAPI;
      var options = {
        url: url,
        body: '"query":"' + query + '"'
      };
      request.defaults({'proxy':'http://graphql-swapi.parseapp.com'});
      request.post(options, function(err, res, body){
        console.log(err, res, body);
      });
    }
    else{
      callback(null, result);
    }
  }
};

module.exports = StarwarService;