var helpers = {
    synchronize: function (synCode) {
        browser.ignoreSynchronization = false;
        return synCode().finally(function () {
            browser.ignoreSynchronization = true;
        });
    },
    takeScreenshot: function (filename, element) {
        var clipRect = element || browser;
        clipRect.takeScreenshot().then(function (png) {
            var stream = fs.createWriteStream('screenshots/'+filename);
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        })
    },
    getCurrentState: function(action){
        return browser.executeScript(function(){
            return angular.element(document).injector().get('menuDetailsBackbox').menuDetails.currentState;
        });
    }
};

var params = {
    url: '172.31.254.65',
    username: 'admin',
    password: '1',

    helpers: helpers
};

exports.params = params;