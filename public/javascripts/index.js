$(function() {
    $.get('/api/v1/order/list', function(data) {
        $('#table').bootstrapTable({
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
            data,
          });
        console.log(data);
    });


});