/***
 GISMapBackend AngularJS App Main Script
 ***/

(function () {
    'use strict';

    angular.module('HMBaseApp')
        .constant('APP_CONSTANT', {
            STORAGE_PREFIX:'<%= projectName %>App'
        });
    /* <%= projectName %>App */
    angular
    .module("<%= projectName %>App", [
        'HMBaseApp'
    ])
    .config(['$ocLazyLoadProvider', 'APP_CONSTANT', function ($ocLazyLoadProvider, APP_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: APP_CONSTANT.DEBUG_INFO_ENABLED,
            modules: [
                <%if (isIncludeRxJS) {%> 
                {
                    name: 'rx',
                    files: ['bower_components/rxjs/dist/rx.lite.compat.js', 'bower_components/rx-angular/dist/rx.angular.min.js']
                }
                <%} if(isIncludeDatatable){%>,
                {
                    name: 'datatables',
                    files: ['bower_components/angular-datatables/dist/css/angular-datatables.min.css', 'bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                    'bower_components/datatables.net/js/jquery.dataTables.js',
                    'bower_components/angular-datatables/dist/angular-datatables.min.js',
                    'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js'
                ]
                }
                <%} if(isIncludeWS){%>,
                {
                    name: 'ngStomp',
                    files: ['bower_components/ng-stomp/dist/ng-stomp.standalone.min.js',]
                }
                <%} if(isIncludeAB){%>,
                {
                    name: 'ui.bootstrap',
                    files: ['bower_components/angular-bootstrap/ui-bootstrap-tpls.js']
                }
                <%}%>
            ]
        });
    }])

}());
