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
        gramController.pullFeed(user.id);
        requestStub.get.called.should.be.ok;
        requestStub.get.calledWith({url: expectedCall, json: true}).should.be.ok;

        done();
    });

    //it('should call for older media on instagram', function(done) {
        //var expectedCall = 'https://api.instagram.com/v1/users/1101/media/recent/?max_id=123access_token=imatoken';

});
