/**
 * 创建时间：2017/8/14 下午3:31
 * 文件：tp.controller.js
 * 创建者：luxiaohui
 **/
(function () {
    'use strict';
    angular
        .module('<%= projectName %>App')
        .controller('TPController', TPController);
    TPController.$inject = ['$scope', '$state', '$stateParams', '$localStorage', 'TPService', 'APP_CONSTANT', '$location'];

    function TPController($scope, $state, $stateParams, $localStorage, TPService, APP_CONSTANT, $location) {
        var vm = this;
        vm.message = '';
        // 1. 检查参数
        if (!$stateParams.apikey || !$stateParams.state) {
            vm.message = '参数不正确';
            console.error(vm.message);
        } else {
            console.log('参数完整');
            //2.3 state 验证
            var state = APP_CONSTANT.TP_STATE_WHITE_LIST;
            var targetState = state.filter(function (s) {
                return s === $stateParams.state;
            });
            var params = {};
            if (targetState && targetState.length === 1) {
                if ($stateParams.extra) {
                    params = $stateParams.extra.split('@').reduce(function (r, item) {
                        var kv = item.split('=');
                        r[kv[0]] = kv[1];
                        return r;
                    }, {});

                }
                console.log('state 正确', params);
            } else {
                vm.message = 'state 不在白名单里';
                console.error(vm.message, params);
                return;
            }
            // 2. apikey 验证
            TPService.service.getData({apiKey: $stateParams.apikey}, function (data) {
                // 2.1 ok
                // 2.2 save token to localstorage
                if (data.errorCode === 0 && data.data) {
                    $localStorage.authenticationToken = data.data;
                    $localStorage.authenticationApiKey = $stateParams.apikey;
                    console.log('apikey 正确');
                } else {
                    vm.message = '验证出错:' + data.msg;
                    console.error(vm.message);
                    return;
                }
                var params = {};
                if ($stateParams.extra) {
                    params = $stateParams.extra.split('@').reduce(function (r, item) {
                        var kv = item.split('=');
                        r[kv[0]] = kv[1];
                        return r;
                    }, {});

                }
                console.log('跳转到 ', $stateParams.state, params);
                $location.search('apikey', null);
                $location.search('state', null);
                $location.search('extra', null);
                for (var k in params) {
                    $location.search(k, params[k]);
                }
                $location.path($stateParams.state).replace();
            }, function (data) {
                // 2.4 error
                vm.message = data.data.msg;
            });

        }

    }
})();
