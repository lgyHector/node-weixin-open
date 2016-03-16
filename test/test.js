var assert = require('assert');
var nwopen = require('../index');
var settings = require('node-weixin-settings');

var app = {
    app_id: process.env.COMPONENT_APP_ID,
    app_secret: process.env.COMPONENT_APP_SECRET
}
var ticket = 'ticket@@@P4Do1LhmY0ABS8H5ggVPxvx7uQJdsKjobAW0JOXM8rWUbH6lgDT2rdfXMW3MdLH3Ront3wQyFAUxvIISzK9rMA';
var pre_auth_code = '';
var component_token = '';
var refresh_token = '';

describe('node-weixin-card', function () {
    /*beforeEach(function(done){
        settings.set(app.app_id, 'auth', {componentAccessToken: token});
        done();
    })*/
    it('should get a component_access_token', function (done) {
        nwopen.componentToken(app, ticket, function(err, data){
            assert.equal(true, typeof data.component_access_token === 'string');
            component_token = data.component_access_token;
            settings.set(app.app_id, 'auth', {componentAccessToken: component_token});
            done();
        });
    })
    it('should get a pre_auth_code', function (done) {
        nwopen.preAuthCode(app, function(err, data){
            assert.equal(true, typeof data.pre_auth_code === 'string');
            pre_auth_code = data.pre_auth_code;
            done();
        })
    })
    it('should query auth info', function(done){
        nwopen.queryAuth(app, pre_auth_code, function(err, data){
            //assert.equal(true, typeof data.authorization_info === 'object');
            refresh_token = data.authorization_info.authorizer_refresh_token;
            done();
        })
    })
    it('should get authorizer token info', function(done){
        nwopen.authorizerToken(app, process.env.APP_ID, refresh_token, function(err, data){
            done();
        })
    })
    it('should get authorizer Info', function(done){
        nwopen.authorizerInfo(app,  function(err, data){
            done();
        })
    })
})