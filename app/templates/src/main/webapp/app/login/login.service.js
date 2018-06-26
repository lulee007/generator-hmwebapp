/**
 * Created by rzhang on 2017/7/6.
 */

(function () {
    'use strict';

    angular
        .module('GISMapFrontendApp')
        .factory('LOGIN', LOGIN);

    LOGIN.$inject = ['$resource','APP_CONSTANT'];

    function LOGIN ($resource,APP_CONSTANT) {
        return $resource(APP_CONSTANT.API_TOKEN_URL, {}, {
            'login': {
                method: 'POST',
            },
        });
    }
})();
