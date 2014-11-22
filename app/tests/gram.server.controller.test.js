'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Gram = mongoose.model('Gram'),
    Q = require('q'),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    requestStub={'get': sinon.stub()},
    gramController = proxyquire('../controllers/grams', {request: requestStub}),
    shouldjsFucksJslint;

/**
 * Globals
 */
var user, gram;

/**
 * Unit tests
 */
describe('Gram Controller Unit Tests:', function() {
    beforeEach(function(done) {
        requestStub.get.reset();
        requestStub.get.onCall(0).callsArgWith(1, null, null, {pagination: {}, data: []});
        done();
    });
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            providerData: {'data': {'id': 1101}, accessToken: 'imatoken'},
            provider: 'instagram'
        });

        user.save(function(err, user, affected) {
            if (err)
                console.log('Error', err);
            done();
        });
    });

    afterEach(function(done){
        Gram.remove().exec();
        done();
    });

    after(function(done){
        User.remove().exec();
        done();
    });

    it('should make initial call to instagram recent media', function(done) {
        var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?access_token=imatoken';
        shouldjsFucksJslint = gramController.should.be.ok;
        gramController.pullFeed(user.id, function (results) {
            shouldjsFucksJslint = requestStub.get.calledOnce.should.be.ok;
            shouldjsFucksJslint = requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;
            done();
        });
    });

    it('should call instagram recent media with min_id', function(done) {
        var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?access_token=imatoken&min_id=666',
            existingGram = new Gram({instagramId: 666, user: user});

        existingGram.save(function() {
            gramController.pullFeed(user.id, function (results) {
                shouldjsFucksJslint = requestStub.get.calledOnce.should.be.ok;
                shouldjsFucksJslint = requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;
                done();
            });
        });
    });

    it('should ask next pages when more', function(done) {
        var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?access_token=imatoken&min_id=666',
            existingGram = new Gram({instagramId: 666, user: user});

        requestStub.get.onCall(0).callsArgWith(1, null, null, {pagination: {next_url: 'http://second'}, data: []});
        requestStub.get.onCall(1).callsArgWith(1, null, null, {pagination: {next_url: 'http://third'}, data: []});
        requestStub.get.onCall(2).callsArgWith(1, null, null, {pagination: {}, data: []});

        existingGram.save(function() {
            gramController.pullFeed(user.id, function (results) {
                requestStub.get.callCount.should.equal(3);
                done();
            });
        });
    });

    it('should return only grams of loggedin user', function(done) {
        var req = sinon.stub(),
            res = sinon.spy(),
            returned;
        Q.all([
            Q.nfcall((new Gram({instagramId: 666, user: user})).save),
            Q.nfcall((new Gram({instagramId: 999, user: user})).save),
            Q.nfcall((new Gram({instagramId: 333, user: null})).save),
            Q.nfcall((new Gram({instagramId: 1333, user: null})).save),
        ]).then(function(){
            req.user = user;
            gramController.list(req, res);
            res.jsonp.callCount.should.equal(1);
            returned = res.args[0];
            returned.should.have.lengthOf(2);
        }).then(done, function(err){
            console.log('This is the truth my dear friend', err);
            done();
        });
    });

});
