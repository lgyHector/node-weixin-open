var request = require('node-weixin-request');
var util = require('node-weixin-util');
var settings = require('node-weixin-settings');
var json2xml = require('json2xml');
var xml2json = require('xml2json');

require('es6-promise').polyfill();

var baseUrl = 'https://api.weixin.qq.com/cgi-bin/component/'

module.exports = {
    _send: function(url, app, data, cb){
        settings.get(app.app_id, 'auth', function(authData){
            var newUrl = url + util.toParam({
                    component_access_token: authData.componentAccessToken
                });
            request.json(newUrl, data, cb);
        })
    },
    componentToken: function(app, ticket, cb){
        var url = baseUrl + 'api_component_token';
        var params = {
            component_appid: app.app_id,
            component_appsecret: app.app_secret,
            component_verify_ticket: ticket
        }
        if(typeof cb == 'function')
            return request.json(url, params, cb);
        return new Promise(function(resolve, reject){
            request.request(url, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            })
        });

    },
    preAuthCode: function(app, cb){
        var url = baseUrl + 'api_create_preauthcode?'
        var params = {
            component_appid: app.app_id
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            });
        }.bind(this))

    },
    queryAuth: function(app, auth_code, cb){
        var url = baseUrl + 'api_query_auth?'
        var params = {
            component_appid: app.app_id,
            authorization_code: auth_code
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            }.bind(this));
        })
    },
    authorizerToken: function(app, auth_appid, refresh_token, cb){
        var url = baseUrl + 'api_authorizer_token?'
        var params = {
            component_appid: app.app_id,
            authorizer_appid: auth_appid,
            authorizer_refresh_token: refresh_token
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            }.bind(this));
        })
    },
    authorizerInfo: function(app, cb){
        var url = baseUrl + 'api_get_authorizer_info?'
        var params = {
            component_appid: app.app_id,
            authorizer_appid: auth_appid
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            }.bind(this));
        })
    },
    authorizerOption: function(app, opt_name, cb){
        var url = baseUrl + 'api_get_authorizer_option?'
        var params = {
            component_appid: app.app_id,
            authorizer_appid: auth_appid,
            option_name: opt_name
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            }.bind(this));
        })
    },
    setAuthorizerOption: function(app, opt_name, opt_value, cb){
        var url = baseUrl + 'api_set_authorizer_option?'
        var params = {
            component_appid: app.app_id,
            authorizer_appid: auth_appid,
            option_name: opt_name,
            option_value: opt_value
        }
        if(typeof cb == 'function')
            return this._send(url, app, params, cb);
        return new Promise(function(resolve, reject){
            this._send(url, app, params, function(err, r){
                if(err) return reject(err);
                resolve(r);
            }.bind(this));
        })
    },
    createURL: function(app, app_id, redirect_url, state, scope){
        var oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
        var params = {
            appid: app_id,
            redirect_uri: redirect_url,
            response_type: 'code',
            scope: ['snsapi_base', 'snsapi_userinfo'][scope],
            state: state,
            component_appid: app.app_id
        }
        return oauthUrl + '?' + util.toParam(params) + '#wechat_redirect';
    },
    authorize: function(app, app_id, code, cb){
        var oauthUrl = 'https://api.weixin.qq.com/sns/oauth2/component/access_token';
        var request = require('request');
        settings.get(app.app_id, 'auth', function(authData){
            var params = {
                appid: app_id,
                code: code,
                grant_type: 'authorization_code',
                component_appid: app.app_id,
                component_access_token: authData.componentAccessToken
            }
            request(oauthUrl + '?' + util.toParam(params), function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    cb(false, JSON.parse(body));
                } else {
                    cb(true, {message: body});
                }
            })
        })
    },
    refresh: function(app, app_id, refresh_token, cb){
        var oauthUrl = 'https://api.weixin.qq.com/sns/oauth2/component/refresh_token';
        var request = require('request');
        settings.get(app.app_id, 'auth', function(authData){
            var params = {
                appid: app_id,
                grant_type: 'refresh_token',
                component_appid: app.app_id,
                component_access_token: authData.componentAccessToken,
                refresh_token: refresh_token,
            }
            request(oauthUrl + '?' + util.toParam(params), function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    cb(false, JSON.parse(body));
                } else {
                    cb(true, {message: body});
                }
            })
        })
    }
}