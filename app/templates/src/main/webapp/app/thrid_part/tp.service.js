/**
* 创建时间：2017/8/14 下午3:31
* 文件：tp.service.js
* 创建者：luxiaohui
**/
(function() {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .factory('TPService', TPService);

    TPService.$inject = ['$resource','APP_CONSTANT'];

    function TPService ($resource,APP_CONSTANT) {
        var service = $resource(APP_CONSTANT.API_HOST+"mapApiKeys/check", {}, {
            'getData': { method: 'GET', isArray: false}
        });
        var view = $resource(APP_CONSTANT.API_HOST+"viewMapProjectInfos/:wid", {}, {
            'detail' : {method: 'GET'}
        });

        return {service:service,view:view};
    }
}());
