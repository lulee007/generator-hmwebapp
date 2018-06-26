(function () {
    'use strict';

    angular
        .module('GISMapFrontendApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', '$stomp', '$resource', 'APP_CONSTANT', '$timeout'];

    function HomeController($scope, $state, $stomp, $resource, APP_CONSTANT, $timeout) {
        var vm = this;
        vm.constant = "#/tp?apikey=" + APP_CONSTANT.API_KEY + "&state=";
        var all_modules = {
            ipad: {
                name: "iPad 端",
                href: vm.constant + "ipad&extra=organizationId=jn",
                src: "assets/global/img/ipad.png"
            },
            ipad_control: {
                name: "iPad 控制端",
                href: vm.constant + "ipad_control&extra=organizationId=jn",
                src: "assets/global/img/ipad_control.png"
            },
            mobile: {
                name: "mobile 端",
                href: vm.constant + "mobile&extra=organizationId=jn@showLayer=true@localDeviceId=dsd4554sdadasadf545",
                src: "assets/global/img/mobile.png"
            },
            touch: {
                name: "触摸屏端",
                href: vm.constant + "touch&extra=organizationId=jinhu@showLayer=true",
                src: "assets/global/img/touch.png"
            },
            broadcastArea: {
                name: "查看播报区域",
                href: vm.constant + "broadcastArea&extra=organizationId=jinhu",
                src: "assets/global/img/broadcastArea.png"
            },
            comprehensive_control: {
                name: "综合管控端",
                href: vm.constant + "control&extra=organizationId=jn@showLayer=true",
                src: "assets/global/img/control.png"
            },
            path: {
                name: "路径规划",
                href: vm.constant + "path&extra=organizationId=jinhu@origin=118.954928,33.040068@destination=119.236403,32.855134@type=drive@cdisabled=true",
                src: "assets/global/img/path.png"
            },
            tourism_supervision: {
                name: "旅游监管",
                href: vm.constant + "tourism_supervision&extra=organizationId=jn",
                src: "assets/global/img/tourism_supervision.png"
            },
            add_coordinate: {
                name: "编辑坐标",
                href: vm.constant + "add_coordinate&extra=wid=1",
                src: "assets/global/img/addCoordinate.png"
            },
            detail_coordinate: {
                name: "查看坐标",
                href: vm.constant + "detail_coordinate&extra=wid=1",
                src: "assets/global/img/detailCoordinate.png"
            },
            jh_big_screen: {
                name: "金湖大屏端",
                href: vm.constant + "jh_big_screen&extra=organizationId=jinhu",
                src: "assets/global/img/jh_big_screen.png"
            },
            big_screen: {
                name: "大屏端",
                href: vm.constant + "big_screen&extra=organizationId=jn",
                src: "assets/global/img/big_screen.png"
            },
            big_screen_controlled: {
                name: "大屏被控端",
                href: vm.constant + "big_screen_controlled&extra=organizationId=jn",
                src: "assets/global/img/big_screen_controlled.png"
            },
            big_screen_show: {
                name: "大屏展示端",
                href: vm.constant + "big_screen_show&extra=organizationId=jn",
                src: "assets/global/img/big_screen_show.png"
            },
            web: {
                name: "web端行程规划",
                href: vm.constant + "web&extra=organizationId=jn@webType=1@wid=8febb782-f8b1-4413-8c72-8ef5ed5d6fc4",
                src: "assets/global/img/web.png"
            },
            ec: {
                name: "电商平台",
                href: vm.constant + "ec&extra=organizationId=jn",
                src: "assets/global/img/ec.png"
            },
            tongli_map_frontend: {
                name: "同里游览车调度系统地图模块",
                href: vm.constant + "tongli_map_frontend",
                src: "assets/global/img/web.png"
            },
            mobile_tour_map: {
                name: "景管通（一张图）",
                href: vm.constant + "one_tourist_map&extra=organizationId=jn@showLayer=true@localDeviceId=dsd4554sdadasadf545",
                src: "assets/global/img/mobile.png"
            },
            jh_comprehensive_control: {
                name: "金湖综合管控端",
                href: vm.constant + "jh_comprehensive_control&extra=organizationId=jinhu",
                src: "assets/global/img/jh_comprehensive_control.png"

            },
            jh_mobile: {
                name: "景管通（移动端）",
                href: vm.constant + "jh_mobile&extra=organizationId=jinhu",
                src: "assets/global/img/jh_mobile.png"
            }
        };

        vm.allPageInfo = ['--inject modules here--']
            .map(function (module) {
                if (!all_modules[module]) {
                    return {module: module};
                } else {
                    return Object.assign({module: module}, all_modules[module]);
                }
            })
            .filter(function (value) {
                return value.href;
            })
            .map(function (info) {
                info.href = info.module + '.html' + info.href;
                return info;
            })
            .reduce(function (r, m) {
                // [[]]  4*n
                console.log(r, m);
                var l = r.length > 0 ? r.length - 1 : 0;
                var group = r[l];
                if (!group) {
                    r[l] = [m];
                } else if (group.length < 4) {
                    r[l].push(m);
                } else {
                    r[l + 1] = [m];
                }
                return r;
            }, []);

    }
})();
