﻿/**
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
        case ''://                 
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
    chrome.storage.local.get(["last_search_time3"], function (storage) {
        var last_search_time = storage.last_search_time3;//最近一次自动搜索时间
        var dateTime = new Date();
        var dateTimeStr = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
        if (last_search_time == null || last_search_time != dateTimeStr) {
            chrome.storage.local.set({ 'last_search_time3': dateTimeStr }, function () {
                auto_search(dateTimeStr);
            });
        }
    })
}

/**
 * 每日自动搜索执行函数
 */
function auto_search(dateTimeStr) {
    var search_count = 0;
    var set_interval_id = setInterval(function () {
        if (search_count > 50) {
            clearInterval(set_interval_id);
            return;
        }
        var search_text = 'Lumia+' + dateTimeStr + '+' + search_count;
        if (search_count <= 30) {
            open_search_tab(0, search_text);
        } else {
            open_search_tab(1, search_text);
        }
        search_count++;
    }, 1500);
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

