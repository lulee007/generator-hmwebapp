(function () {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('login', {
            parent: 'app',
            url: "/login",
            views: {
                "root@": {
                    templateUrl: "app/login/login.html",
                    controllerAs: 'vm',
                    controller: "LoginController"
                }
            },
            data: {
                pageTitle: '登录'
            },
            resolve: {
                loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_js_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            // <insert all js here>
                            'app/login/login.all.service.js',
                            'app/login/login.controller.js'
                        ]
                    });
                }],
                loadCss: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_css_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            // <insert all css here>
                            'assets/pages/css/login.min.css'
                        ]
                    });
                }]
            }
        });
    }
}());
