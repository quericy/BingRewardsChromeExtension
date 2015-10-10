/**
 * @file 后台脚本文件
 * @brief 扩展常驻后台运行的脚本
 * @author quericy
 * @version 1.0
 * @date 2015-10-09
 */
 
//=======变量定义Begin=======

//=======变量定义End=======


//=======后台消息监听Begin=======
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.act) {
        case 'run_auto_search'://执行手动触发自动搜索
            var date_time = new Date();
            var dateTimeStr = date_time.getFullYear() + "-" + (date_time.getMonth() + 1) + "-" + date_time.getDate();
            auto_search(dateTimeStr,1500);
            break;
        case 'stop_auto_search'://终止手动触发自动搜索
            chrome.storage.local.get(['search_thread_id'], function (storage) {
                var search_thread_id = storage.search_thread_id;
                if (search_thread_id != null) {
                    clearInterval(search_thread_id);//kill已有定时搜索任务
                }
            });
            break;
        default:
            sendResponse('error_action');
            break;
    }
    return;
});
//=======后台消息监听End=======


//=======后台定时任务Begin=======
chrome.alarms.create('auto_refresh', { when: Date.now(), periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(function (alarm) {
    switch (alarm.name) {
        case 'auto_refresh'://后台定时每分钟执行1次
            everyday_search_check();
            break;
        default:
            break;
    }
});
//=======后台定时任务End=======


//=======手机搜索修改UA请求监听Begin=======
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    var headers = details.requestHeaders;
    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == 'User-Agent') {
            break;
        }
    }
    if (i < headers.length) {
        headers[i].value = 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
    }
    return { requestHeaders: headers };
}, { urls: ['*://www.bing.com/search?mobile=1*'] }, ['requestHeaders', 'blocking']);
//=======手机搜索修改UA请求监听End=======


//=======函数定义Begin=======
/**
 * 每日自动搜索检测函数
 */
function everyday_search_check() {
    chrome.storage.local.get(['last_search_time', 'search_status', 'search_start_time', 'search_time_step'], function (storage) {
        if (storage.search_status != null && storage.search_status != 1) {
            return;//关闭自动搜索
        }
        var last_search_time = storage.last_search_time;//最近一次自动搜索时间
        var search_start_time = storage.search_start_time;//搜索起始小时
        var search_time_step = storage.search_time_step;//搜索执行间隔
        search_start_time == null ? 10 : search_start_time;
        search_time_step == null ? 1500 : search_time_step;
        var date_time = new Date();
        var now_hour = date_time.getHours();
        if (now_hour < search_start_time) {
            return;//还没到时间
        }
        var dateTimeStr = date_time.getFullYear() + "-" + (date_time.getMonth() + 1) + "-" + date_time.getDate();
        if (last_search_time == null || last_search_time != dateTimeStr) {
            chrome.storage.local.set({ 'last_search_time': dateTimeStr }, function () {
                auto_search(dateTimeStr, search_time_step);
            });
        }
    })
}

/**
 * 每日自动搜索执行函数
 */
function auto_search(dateTimeStr, search_time_step) {

    chrome.storage.local.get(['search_thread_id'], function (storage) {
        var search_thread_id = storage.search_thread_id;
        if (search_thread_id != null) {
            clearInterval(search_thread_id);//kill已有定时搜索任务
        }
        var set_interval_id = search_thread(dateTimeStr, search_time_step);
        //记录定时搜索任务ID
        chrome.storage.local.set({ 'search_thread_id': set_interval_id });
    });
}

function search_thread(dateTimeStr, search_time_step) {
    //创建定时搜索任务
    var search_count = 0;
    var set_interval_id = setInterval(function () {
        if (search_count > 50) {
            //执行完成,清除定时搜索任务
            chrome.storage.local.set({ 'search_thread_id': null }, function () {
                clearInterval(set_interval_id);
            });
            return;
        }
        var search_text = 'Lumia+' + dateTimeStr + '+' + search_count;
        if (search_count <= 30) {
            open_search_tab(0, search_text);
        } else {
            open_search_tab(1, search_text);
        }
        search_count++;
    }, search_time_step);
    return set_interval_id;
}

/**
 * 搜索标签页弹出/刷新函数
 */
function open_search_tab(is_mobile, search_text) {
    var search_url = 'https://www.bing.com/search';
    chrome.tabs.query({
        url: search_url + '*'
    }, function (tabArray) {
        if (tabArray == null || tabArray.length == 0) {
            chrome.tabs.create({ url: search_url + '?mobile=' + is_mobile + '&q=' + search_text, selected: false });//开启新搜索页

        } else {
            chrome.tabs.update(tabArray[0].id, { 'url': search_url + '?mobile=' + is_mobile + '&q=' + search_text });//已有搜索页跳转搜索刷新
        }
    });
}
//=======函数定义End=======

