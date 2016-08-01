/**
 * Created by sshao on 6/9/2016.
 */

"use strict";

require('../utils/StringHelper');
var EasyAddressConstants = require('../constants/EasyAddressConstants');

var AddressHelper = {
  assembleAddress: function(item, country){
    if(country !== EasyAddressConstants.Countries.us){
      var address = item.get('Address');
      var countryName = item.get('CountryName');
      return address + ', ' + countryName;
      //var address1 = item.get('Address1');
      //var deliveryAddress = item.get('DeliveryAddress');
      //var city = item.get('Locality');
      //var state = item.get('AdministrativeArea');
      //var postalCode = item.get('PostalCode');
      //var country = item.get('CountryName');
      //var text = EasyAddressConstants.AddrFormat['global'].format(address1, city, state, postalCode, country);
      //return text;
    }
    else{
      var addressLine1 = item.get('AddressLine1');
      var city = item.get('City');
      var suiteCount = item.get('SuiteCount');
      var suiteName = item.get('SuiteName');
      var state = item.get('State');
      var postalCode = item.get('PostalCode');
      var text = EasyAddressConstants.AddrFormat['us'].format(addressLine1, !suiteCount || !suiteName ? '' : (suiteName + ', '), city, state, postalCode);
      return text;
    }
  }

};

module.exports = AddressHelper;