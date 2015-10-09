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
        case ''://                 
            break;
        default:
            sendResponse('error_action');
            break;
    }
    return;
});
//=======后台消息监听End=======

//=======后台定时任务初始化Begin=======

//=======后台定时任务初始化End=======

//=======函数定义Begin=======

//=======函数定义End=======

