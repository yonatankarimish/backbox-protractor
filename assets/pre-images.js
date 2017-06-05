/**
 * Created by Yonatan on 01/06/2017.
 */
angular.module('bbTests', []);

angular.module('bbTests').service('imageService', [function(){
    var images = []; //will be injected by gulp script
    return {
        images: images
    };
}]);

angular.module('bbTests').controller('testCtrl', ['imageService', function(imageService){
    var ctrl = this;
    ctrl.images = imageService.images;

    ctrl.generateTitle = function(path){
        var name =  path.split('/').splice(-1);
        return name[0].split('_').join(' ').split('.')[0];
    }
}]);

angular.module('bbTests').filter('beautify', function () {
    return function (string) {
        try {
            var split = string.match(/[A-Z]*[a-z_ ]*/g);
            split = split.join(" ").split(/[_ ]+/g);
            for (var s in split)
                split[s] = split[s].charAt(0).toUpperCase() + split[s].slice(1).toLowerCase();
            return split.join(" ");
        } catch (e) {
            return string;
        }
    }
});