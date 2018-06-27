(function() {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
            parent: 'app',
            url: '/',
            data: {
                pageTitle: '主页'
            },
            views: {
                'root@': {
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                }
            },
            resolve:{
                loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie:true,
                        insertBefore: '#ng_load_js_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            'app/home/home.controller.js'
                        ]
                    });
                }],
                loadCss: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_css_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            'app/home/home.all.css'
                        ]
                    });
                }]
            }
        });
    }
})();
