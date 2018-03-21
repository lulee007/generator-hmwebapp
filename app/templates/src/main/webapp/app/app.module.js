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
    angular.module("<%= projectName %>App", [
        'HMBaseApp'<%if (isIncludeDatatable) {%>,
        'datatables'<%} if(isIncludeWS){%>,
        'ngStomp'<%}%>
    ]);

})();
