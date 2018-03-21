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
                            'app/login/login.service.js',
                            'app/login/login.controller.js'
                        ]
                    });
                }],
                loadCss: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_css_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            'assets/pages/css/login.min.css'
                        ]
                    });
                }]
            }
        })
    }
})();
