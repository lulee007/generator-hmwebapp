(function () {
   'use strict';

   angular
       .module('<%= projectName %>App')
       .constant('APP_CONSTANT',{
           //debug信息启用
           DEBUG_INFO_ENABLED: true,
        //    'API_HOST':'http://xxx',
           //认证白名单
           AUTH_WHITE_LIST:[/http:\/\/xxx/, /gateway\/api\/authenticate/,/gateway\/simsgisxxxxx\/api\/mapApiKeys\/check/],
           //验证请求地址
           API_TOKEN_URL:'gateway/api/authenticate',
           STATE_WHITE_LIST: ['404', '403', '500', 'tp',''],
           TP_STATE_WHITE_LIST:[''],
           // API_HOST:''
       });
})();
