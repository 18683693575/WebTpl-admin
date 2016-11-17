layui.config({
  base: '../../src/js/lib/'
}).extend({
  datatable: 'datatable'
});
layui.use(['layer', 'jquery', 'laypage', 'datatable', 'laytpl'], function() {
  var $ = layui.jquery,
    layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl;
  $(function() {
    /**
     * 渲染数据
     */
    $.ajax({
      type: "get",
      url: "../../../json/article.json",
      async: false,
      success: function(data) {
        var nums = 10; //初始化每页显示的数量
        var render = function(curr) {
          var str = '',
            last = curr * nums - 1;
          last = last >= data.length ? (data.length - 1) : last;
          for(var i = (curr * nums - nums); i <= last; i++) {
            var item = data[i];
            var html = table.innerHTML;
            //处理数据项
            item.releaseTime = replaceTime(Math.round(item.releaseTime / 1000));
            laytpl(html).render(item, function(html) {
              str += html;
            });
          }
          return str;
        }
        laypage({
          cont: 'article-page',
          pages: Math.ceil(data.length / nums), //得到总页数
          curr: 1,
          groups: 5,
          skip: true,
          hash: "page",
          jump: function(obj, first) {
            var curr = obj.curr;
            view.innerHTML = render(obj.curr);
          }
        });
      },
      error: function(e) {
        layerMsg("网络错误", 2);
      }
    });
    /**
     * 数据table化
     */
    $('.table-sort').dataTable({
      "searching": false, //是否允许Datatables开启本地搜索
      "paging": false, //是否开启本地分页
      "lengthChange": false, //是否允许产品改变表格每页显示的记录数
      "info": false, //控制是否显示表格左下角的信息
      //跟数组下标一样，第一列从0开始，这里表格初始化时，第四列默认降序
      "order": [1, 'desc'], //asc升序   desc降序 
      "aoColumnDefs": [{
          "sProcessing": "正在加载中......",
          "sEmptyTable": "无数据",
          "orderable": false,
          "aTargets": [0, 4]
        } // 指定列不参与排序
      ]
    });
    $('.table-sort tbody').on('click', 'tr', function() {
      if($(this).hasClass('selected')) {
        $(this).removeClass('selected');
      } else {
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
      }
    });
  });
  //文章--查看
  $('.btn-showuser').on('click', function() {
    var username = $(this).html();
    var href = 'article-show.html';
    var id = $(this).parents('tr').attr('data-userid');
    console.log(id);
    layer_show(username, href, id, '360', '400');
  });
  /*文章-添加*/
  $('#btn-adduser').on('click', function() {
    var username = $(this).html();
    var href = 'article-add.html';
    layer_show(username, href, '', '800', '600');
  });
  /*文章--停用*/
  $('.table-sort').on('click', '.handle-btn-stop', function() {
    var obj = $(this);
    var id = obj.parents('tr').attr('data-userid');
    layer.confirm('确认要暂停发布吗？', {
      icon: 0,
      title: '警告'
    }, function(index) {
      $(obj).parents("tr").find(".td-handle").prepend('<span class="handle-btn handle-btn-run" title="开始发布"><i class="linyer icon-qiyong"></i></span>');
      $(obj).parents("tr").find(".td-status").html('<span class="label label-default radius">暂停发布</span>');
      $(obj).remove();
      layer.msg('已暂停发布!', {
        icon: 5,
        time: 1000
      });
    });
  });
  /*文章--启用*/
  $('.table-sort').on('click', '.handle-btn-run', function() {
    var obj = $(this);
    var id = obj.parents('tr').attr('data-userid');
    layer.confirm('确认要开始发布吗？', {
      icon: 0,
      title: '警告'
    }, function(index) {
      $(obj).parents("tr").find(".td-handle").prepend('<span class="handle-btn handle-btn-stop" title="暂停发布"><i class="linyer icon-zanting"></i></span>');
      $(obj).parents("tr").find(".td-status").html('<span class="label label-success radius">正常发布</span>');
      $(obj).remove();
      layer.msg('已开始发布!', {
        icon: 6,
        time: 1000
      });
    });
  });
  /*文章-编辑*/
  $('.table-sort').on('click', '.handle-btn-edit', function() {
    var obj = $(this);
    var id = obj.parents('tr').attr('data-userid');
    layer_show('编辑', 'article-edit.html', id, '600', '500');
  });
  /*文章-删除*/
  $('.table-sort').on('click', '.handle-btn-delect', function() {
    var obj = $(this);
    var id = obj.parents('tr').attr('data-userid');
    layer.confirm('确认要删除吗？', {
      icon: 0,
      title: '警告'
    }, function(index) {
      $(obj).parents("tr").remove(); //删除方法
      layer.msg('已删除!', {
        icon: 1,
        time: 1000
      });
    });
  });
});