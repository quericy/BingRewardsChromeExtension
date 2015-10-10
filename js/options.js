/**
 * @file 选项界面脚本文件
 * @brief 对扩展进行设置使用的用户脚本文件
 * @author quericy
 * @version 1.0
 * @date 2015-10-10
 */

//=======页面执行Begin=======

$(function () {
    $("[name='my-checkbox']").bootstrapSwitch();
    setting_page_load();

});
//=======页面执行End=======


//=======函数定义Begin=======
/**
 * 页面加载完成后执行函数
 */
function setting_page_load() {
    $('#save_btn').attr('disabled', 'disabled');
    $('#search_status').bootstrapSwitch('disabled', true);
    var loading_html = '<div  class="alert alert-info alert-dismissible fade in" role="alert"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;设置加载中...</div>';
    $('#header_tips').html(loading_html);
    chrome.storage.local.get(['search_status', 'search_start_time', 'search_time_step'], function (storage) {
        //自动搜索开关状态
        $('#search_status').bootstrapSwitch('disabled', false);
        if (storage.search_status == null || storage.search_status == 1) {
            $('#search_status').bootstrapSwitch('state', true);
        } else {
            $('#search_status').bootstrapSwitch('state', false);
        }
        //console.log(setting);
        $('#search_start_time').val(storage.search_start_time);
        $('#search_time_step').val(storage.search_time_step);
        $('#header_tips').html('');
        $('#save_btn').removeAttr('disabled');
    })
}

/**
 * 保存按钮触发事件
 */
$('#save_btn').click(function () {
    $('#header_tips').html('');
    var search_status = $('#search_status').bootstrapSwitch('state') == true ? 1 : 0;
    var search_start_time = $('#search_start_time').val();
    var search_time_step = $('#search_time_step').val();

    var fail_html = '<div  class="alert alert-danger alert-dismissible fade in" role="alert"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;';
    var success_html = '<div  class="alert alert-success alert-dismissible fade in" role="alert"><span class="glyphicon glyphicon-ok-sign"></span>&nbsp;&nbsp;';
    if (search_start_time == '') {
        search_start_time = null;
    } else if (isNaN(search_start_time) || search_start_time < 0 || search_start_time > 23) {
        fail_html += '自动搜索开始时间不合法!';
        $('#header_tips').html(fail_html + '</div>');
        return;
    }
    if (search_time_step == '') {
        search_time_step = null;
    } else if (isNaN(search_time_step) || search_time_step < 500) {
        fail_html += '搜索间隔时间不合法!';
        $('#header_tips').html(fail_html + '</div>');
        return;
    }
    chrome.storage.local.set({ 'search_status': search_status, "search_start_time": search_start_time, "search_time_step": search_time_step }, function () {
        success_html += '设置保存成功!';
        $('#header_tips').html(success_html + '</div>');
    })

});

/**
 * 放弃按钮触发事件
 */
$('#reload_btn').click(function () {
    document.location.reload();
});
//=======函数定义End=======