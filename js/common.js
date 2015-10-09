/**
 * @file 公共脚本
 * @brief 存放共用函数和方法等
 * @author quericy
 * @version 1.0
 * @date 2015-10-09
 */
 
//=======函数定义Begin=======
/**
 * 日志记录函数
 * @param result 日志类型
 * @param action 日志信息
 * @param data 日志数据
 */
function AddLog(result, action, data) {
  var data_obj = { 'result': result, 'time': new Date().toLocaleString(), 'action': action, 'data': data };
  chrome.runtime.sendMessage({ act: 'add_log', data: data_obj });
}

/**
 * html转义函数
 * @param str 待转义字符串
 */
function html_encode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&gt;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br>");
  return s;
}   
 
/**
* html反转义函数
* @param str 待反转义字符串
*/
function html_decode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&gt;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/<br>/g, "\n");
  return s;
}
//=======函数定义End=======