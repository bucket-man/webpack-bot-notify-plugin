'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

var wecom_notify_url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send';
var WabpackNotifyPlugin = /** @class */ (function () {
    function WabpackNotifyPlugin(config) {
        var channel = config.channel, key = config.key;
        if (channel == 'wecom') {
            this.url = "".concat(wecom_notify_url, "?key=").concat(key);
        }
        this.config = config;
    }
    WabpackNotifyPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (compiler.hooks && compiler.hooks.done) {
            compiler.hooks.done.tapAsync('WabpackNotifyPlugin', function (state, cb) {
                _this.pluginDoneFn(state, cb);
            });
        }
        else {
            if (typeof compiler.plugin === 'undefined')
                return;
            compiler.plugin('done', function (state, cb) {
                _this.pluginDoneFn(state, cb);
            });
        }
    };
    WabpackNotifyPlugin.prototype.pluginDoneFn = function (state, cb) {
        var _a = this.config, channel = _a.channel, content = _a.content;
        if (!channel) {
            console.warn('未填写通知渠道。');
            return;
        }
        if (!content) {
            console.warn('未填写通知内容。');
            return;
        }
        if (channel == 'wecom') {
            var msgtype = content.msgtype;
            var params = {
                msgtype: msgtype,
            };
            params[msgtype] = content[msgtype];
            this.sendWecomNotify(params).then(function (response) {
                cb();
            }).catch(function (error) {
                cb();
            });
        }
        else {
            console.warn('不支持当前渠道，请根据文档设置。');
        }
    };
    WabpackNotifyPlugin.prototype.sendWecomNotify = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            axios__default["default"].post(_this.url, data).then(function (response) {
                var status = response.status, data = response.data;
                if (status == 200) {
                    var errcode = data.errcode, errmsg = data.errmsg;
                    if (errcode == 0) {
                        resolve(data);
                    }
                    else {
                        console.error(errmsg);
                        reject(data);
                    }
                }
                else {
                    reject(data);
                }
            }).catch(function (error) {
                console.error(error);
                reject(error);
            });
        });
    };
    return WabpackNotifyPlugin;
}());

exports.WabpackNotifyPlugin = WabpackNotifyPlugin;
