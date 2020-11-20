$(function() {
    $('#order').bootstrapTable({
        url: '/api/v1/order/list',
        queryParams: function(params) {
            params.limit = 10;
            params.type = $('#settlement-type :selected').val();
            return params;
        },
        theadClasses: 'thead-dark text-center',
        sortClass: 'row',
        columns: [{
          field: 'userName',
          title: '姓名',
        }, {
          field: 'itemName',
          title: '餐点',
        }, {
          field: 'price',
          title: '价钱',
        }],
        pageList: [],
        pageSize: 10,
        pagination: true,
        paginationLoop: false,
        sidePagination: 'server',
        height: 598,
    });

    $('#statistics').bootstrapTable({
        url: '/api/v1/order/list',
        queryParams: function(params) {
            params.limit = 100;
            params.type = $('#settlement-type :selected').val();
            return params;
        },
        theadClasses: 'thead-dark text-center',
        sortClass: 'row',
        columns: [{
          field: 'userName',
          title: '姓名',
        }, {
          field: 'itemName',
          title: '餐点',
        }, {
          field: 'price',
          title: '价钱',
        }],
        height: 598,
    });

    $('#settlement').click(function() {
        $.post('/api/v1/order/settlement').then(function(res) {
            $('#order').bootstrapTable('refresh');
        });
    })

    $('#settlement-type').change(function() {
        $('#order').bootstrapTable('refresh');
    })
});