/**
 * Created by Yonatan on 28/05/2017.
 */
var fs = require('fs');
var browserProfiles = require('./assets/browser-profiles.js');
var params = require('./assets/params.js').params;

exports.config = {
    autoStartStopServer: true,
    baseUrl: 'https://'+params.url+'/',
    directConnect: false,
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    },
    //getMultiCapabilities: browserProfiles.getProfiles,
    multiCapabilities: [/*{
        browserName: 'firefox'
    }, */{
        browserName: 'chrome'
    },{
        browserName: 'internet explorer',
        platform: 'ANY',
        version: '11'
    }],
    params: params,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['specs/settings-spec.js'],
    seleniumArgs: [ "-Dwebdriver.firefox.profile=default"], // -Dwebdriver.ie.driver=C:/Windows/System32/IEDriverServer_x64_3.4.0/IEDriverServer.exe" ],
    onPrepare: function() {
        jasmine.getEnv().addReporter(new function() {
            this.specDone = function(result) {
                if (result.failedExpectations.length >0) {
                    console.log('tests have failed. taking pictures at error points');
                    try {
                        browser.executeScript(function () {
                            var state = angular.element(document).injector().get('menuDetailsBackbox').menuDetails.currentState;
                            console.log('test failed at:', state);
                        });
                    }catch(e){
                        console.log('failed to take picture of error', e);
                    }
                    //params.helpers.takeScreenshot('screenshots/errors/');
                }
            };
        });

        browser.driver.manage().window().maximize();
        browser.driver.get('https://'+params.url+'/');

        browser.driver.findElement(by.id('j_username')).sendKeys(browser.params.username);
        browser.driver.findElement(by.id('j_password')).sendKeys(browser.params.password);
        browser.driver.findElement(by.id('submitBtn')).click();

        // Login takes some time, so wait until it's done.
        // For the test app's login, we know it's done when it redirects to
        // index.html.
        return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl();
        }, 10000);
    }
};