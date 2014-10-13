'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    fakeServer = require('sinon/lib/sinon/util/fake_server'),
    User = mongoose.model('User'),
    Gram = mongoose.model('Gram'),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    requestStub={'get': sinon.spy()},
    gramController = proxyquire('../controllers/grams', {request: requestStub});

/**
 * Globals
 */
var user, gram;

/**
 * Unit tests
 */
describe('Gram Controller Unit Tests:', function() {
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            providerData: {'data': {'id': 1101}, accessToken: 'imatoken'}
        });

        user.save(function() {
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

    it("should make initial call to instagram recent media", function(done) {
        var results,
            expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?access_token=imatoken';
        gramController.should.be.ok;
        results = gramController.providerGet(user);
        requestStub.get.calledOnce.should.be.ok;
        requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;

        done();
    });

    it("should call for older media on instagram", function(done) {
        var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?max_id=123access_token=imatoken';

});
