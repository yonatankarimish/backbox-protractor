/**
 * Created by Yonatan on 01/06/2017.
 */
angular.module('bbTests', []);

angular.module('bbTests').service('imageService', [function(){
    var images = ["screenshots/settings_access.png", "screenshots/settings_access_Add.png", "screenshots/settings_access_Delete.png", "screenshots/settings_access_Edit.png", "screenshots/settings_administration_Cluster.png", "screenshots/settings_administration_Customizations.png", "screenshots/settings_administration_Maintenance.png", "screenshots/settings_administration_Settings.png", "screenshots/settings_agents.png", "screenshots/settings_agents_Add.png", "screenshots/settings_agents_Delete.png", "screenshots/settings_agents_Edit.png", "screenshots/settings_agents_Remove From Group.png", "screenshots/settings_agents_Upgrade.png", "screenshots/settings_alerts_HTTP.png", "screenshots/settings_alerts_SMTP.png", "screenshots/settings_alerts_SNMP_monitoring.png", "screenshots/settings_alerts_SNMP_traps.png", "screenshots/settings_alerts_Syslog.png", "screenshots/settings_dns.png", "screenshots/settings_interfaces.png", "screenshots/settings_interfaces_Edit.png", "screenshots/settings_license.png", "screenshots/settings_logs.png", "screenshots/settings_routing.png", "screenshots/settings_routing_Add.png", "screenshots/settings_routing_Delete.png", "screenshots/settings_routing_Edit.png", "screenshots/settings_sites.png", "screenshots/settings_sites_Add.png", "screenshots/settings_sites_Delete.png", "screenshots/settings_sites_Edit.png", "screenshots/settings_time.png", ]; //will be injected by gulp script
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