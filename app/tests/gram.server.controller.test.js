'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
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
    beforeEach(function(done) {
        requestStub.get.reset();
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
                console.log("Error", err);
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
        gramController.should.be.ok;
        gramController.pullFeed(user.id, function (results) {
            requestStub.get.calledOnce.should.be.ok;
            requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;
            done();
        });
    });

    it('should call instagram recent media with min_id', function(done) {
        var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?access_token=imatoken&min_id=666',
            existingGram = new Gram({instagramId: 666, user: user});

        existingGram.save(function() {
            gramController.pullFeed(user.id, function (results) {
                requestStub.get.calledOnce.should.be.ok;
                requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;
                done();
            });
        });
    });

});
