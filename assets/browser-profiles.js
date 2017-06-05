/**
 * Created by Yonatan on 04/06/2017.
 */
var q = require('q');
var FirefoxProfile = require('firefox-profile');
var params = require('../assets/params.js').params;

exports.getProfiles = function(){
    var deferred = q.defer();
    var profile = FirefoxProfile.copy('C:\Users\User\AppData\Roaming\Mozilla\Firefox\Profiles\0yrgbuvp.selenium')
    //var profile = new FirefoxProfile();
    profile.setPreference('browser.newTab.url', 'https://'+params.url+'/');
    profile.setAcceptUntrustedCerts(true);
    profile.setAssumeUntrustedCertIssuer(false);
    profile.encoded(function(encodedProfile){
        var multiCapabilities = [{
            browserName: 'firefox',
            firefox_profile : encodedProfile
        }];
        deferred.resolve(multiCapabilities);
    });
    return deferred.promise;
};