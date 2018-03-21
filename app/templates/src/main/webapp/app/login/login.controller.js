(function() {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$stateParams','$state','$localStorage','$sessionStorage','$location','APP_CONSTANT','LOGIN'];

    function LoginController ($stateParams,$state,$localStorage,$sessionStorage,$location,APP_CONSTANT,LOGIN) {
        var vm = this;
        vm.info={
            "username":"",
            "password":"",
            "rememberMe":true
        };

        vm.doLogin = function () {
            vm.info.username=vm.username;
            vm.info.password=vm.password;
            vm.info.rememberMe=vm.rememberMe;
            if(vm.username==null){
                // $(".uppercase").attr("disabled",true);
                return
            }else if(vm.password==null){
                // $(".uppercase").attr("disabled",true);
                return
            }else {
                $(".uppercase").attr("disabled",false);
            }
            LOGIN.login(vm.info,function (data) {
                if(data.id_token){
                    $localStorage.authenticationToken = data.id_token;
                    localStorage.setItem("token", data.id_token);
                }
                $localStorage.authenticationToken = data.id_token;
                // console.log(data);
                $location.path('/').replace();
            },function () {
                alert("账号密码错误")
            });
            // if(vm.rememberMe){
            //     $localStorage.authenticationToken = APP_CONSTANT.API_TOKEN;
            // } else {
            //     $sessionStorage.authenticationToken = APP_CONSTANT.API_TOKEN;
            // }
            // $location.path('/').replace();
        }
    }
})();
