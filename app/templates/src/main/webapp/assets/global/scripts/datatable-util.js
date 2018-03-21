var DataTableUtil = (function () {
    var builder = {};
    var params = function () {
        return {};
    };
    var url = "";
    return {
        fromBaseBuilder: baseBuilder,
        withData: withData,
        build: build
    };
    /**
     * 
     * @param {*} DTOptionsBuilder 
     */
    function baseBuilder(DTOptionsBuilder) {
        builder = DTOptionsBuilder.newOptions()
            .withOption('processing', true)
            .withOption("serverSide", true)
            .withOption('bFilter', false)
            .withOption('ordering', false)
            .withOption('lengthChange', false)
            .withLanguage({
                "lengthMenu": "每页显示 _MENU_ 条记录",
                "zeroRecords": "对不起，查询不到任何相关数据",
                "info": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                "infoEmpty": "没有可展示的数据",
                "infoFiltered": "数据表中共为 _MAX_ 条记录)",
                "processing": "正在加载中...",
                "search": "搜索",
                "emptyTable": "未查询到相关数据",
                "paginate": {
                    "first": "第一页",
                    "previous": " 上一页 ",
                    "next": " 下一页 ",
                    "last": " 最后一页 "
                }
            });
        return this;
    }

    /**
     *
     * @param _url 分页地址
     * @param cb 参数采用回调形式
     * @returns {DataTableUtil}
     */
    function withData(_url, cb) {
        console.log(_url)
        if (typeof(_url) !== "string") {
            console.error("地址错误：" + _url);
        } else {
            url = _url;
        }
        if (cb instanceof Function === false) {
            console.error("参数回调函数设置错误：" + cb);
        } else {
            params = cb;
        }
        return this;
    }

    function build() {
        var value = localStorage.getItem("token");
        return builder.withOption("ajax", {
            dataSrc: "data",
            headers: {Authorization: 'Bearer '+value},
            url: url,
            data: function (d) {
                // 过滤其他不用参数
                var p = {pageNum:d.start/d.length+1,pageSize:d.length};
                // console.log(p);
                return $.extend({}, p, params());
            },
            type: "GET"
        });
    }
})();
