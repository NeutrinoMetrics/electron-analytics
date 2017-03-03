'use strict';
const expect = require('chai').expect;
const IPCUtils = require('../utils/ipcUtils');


describe('#ipcutils', function() {
    it('should be false for renderer process', function() {
        let result = IPCUtils.isRenderer()
        expect(result).to.equal(false);
    });
});
