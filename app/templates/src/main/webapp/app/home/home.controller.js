(function() {
    'use strict';

    angular
        .module('<%= projectName %>App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope' ,'$state'];

    function HomeController ($scope, $state) {
        var vm = this;

    }
})();
