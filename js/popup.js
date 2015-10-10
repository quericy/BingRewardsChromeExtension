/**
 * @file 弹出层脚本文件
 * @brief 点击图标触发弹出层执行的脚本文件
 * @author quericy
 * @version 1.0
 * @date 2015-10-10
 */

//=======页面执行Begin=======
$(function () {
    chrome.storage.local.get(['search_thread_id'], function (storage) {
		var search_thread_id = storage.search_thread_id;
		if (search_thread_id == null) {
			$('#search_pannel').html('<a id="run_auto_search" href="#"><span class="glyphicon glyphicon-hand-up"></span>手动执行搜索</a>');
		} else {
			$('#search_pannel').html('<a id="stop_auto_search" href="#"><span class="glyphicon glyphicon-minus-sign"></span>停止自动搜索</a>');
		}
	});
});


$(document).delegate('#run_auto_search', 'click', function () {
	chrome.runtime.sendMessage({ act: 'run_auto_search' }, function (result) {
		
	});
});


$(document).delegate('#stop_auto_search', 'click', function () {
	chrome.runtime.sendMessage({ act: 'stop_auto_search' }, function (result) {
		
	});
});
//=======页面执行End=======


//=======函数定义Begin=======

//=======函数定义End=======