/**
 * 创建时间：2017/8/14 下午3:32
 * 文件：tp.state.js
 * 创建者：luxiaohui
 **/
(function () {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('tp', {
            parent: 'app',
            url: "/tp?apikey&state&extra",
            views: {
                "root@": {
                    templateUrl: "app/thrid_part/loading.html",
                    controllerAs: 'vm',
                    controller: "TPController",
                }
            },
            data: {
                pageTitle: '正在加载...'
            },
            resolve: {
                loadJs: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_js_plugins_before',
                        files: [
                            'app/thrid_part/thrid_part.all.service.js',
                            'app/thrid_part/tp.controller.js'
                        ]
                    });
                }],
                loadCss: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        insertBefore: '#ng_load_css_plugins_before', // load js  css files before a LINK element with this ID.
                        files: [
                            'app/thrid_part/thrid_part.all.css'
                        ]
                    });
                }]
            }
        });
    }
}());
