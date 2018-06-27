(function () {
   'use strict';
   // DO NOT EDIT THIS FILE, EDIT THE GULP TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE
   angular
       .module('<%= projectName %>App')
       .constant('APP_CONSTANT',{
           'VERSION': "1.0.0",
           //debug信息启用
           'DEBUG_INFO_ENABLED': true,
        //    'API_HOST':'http://xxx',
           //认证白名单
           'AUTH_WHITE_LIST':[/http:\/\/xxx/, /http:\/\/xxx:8888\/api\/authenticate/],
           //验证请求地址
        //    'API_TOKEN_URL':'http://xxx:8888/api/authenticate',
           'STATE_WHITE_LIST': ['404', '403', '500', 'tp',''],
       });
})();
