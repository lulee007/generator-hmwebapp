(function () {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$stateParams', '$state', '$localStorage', '$sessionStorage', '$location', 'APP_CONSTANT', 'LOGIN'];

    function LoginController($stateParams, $state, $localStorage, $sessionStorage, $location, APP_CONSTANT, LOGIN) {
        var vm = this;
        vm.info = {
            "username": "",
            "password": "",
            "rememberMe": true
        };
        $('input[type="password"]').keydown(function (e) {
            if (e.keyCode === 13) {
                vm.doLogin();
            }
        });
        vm.doLogin = function () {

            vm.info.username = vm.username;
            vm.info.password = vm.password;
            vm.info.rememberMe = vm.rememberMe;
            if (!vm.username) {
                return;
            } else if (!vm.password) {
                return;
            } else {
                $(".uppercase").attr("disabled", false);
            }
            // console.log(vm.info);
            LOGIN.login(vm.info, function (data) {
                console.log(data);
                if (vm.rememberMe) {
                    $localStorage.authenticationToken = data.id_token;
                } else {
                    $sessionStorage.authenticationToken = data.id_token;
                }
                $location.path('/').replace();
            }, function (data) {
                console.log(data);
                alert("账号密码错误");
            });
        };
    }
})();
