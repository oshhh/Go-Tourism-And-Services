describe('Functions', function() {
    'use strict';

    describe('Function byte()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.byte).to.be.a('function');
        });

        it('Should convert size in a readable byte string', function() {
            expect(FireTPL.fn.byte('328')).to.eql('328 Byte');
        });

        it('Should convert size in a readable KiB string', function() {
            expect(FireTPL.fn.byte('1328')).to.eql('1.3 KiB');
        });

        it('Should convert size in a readable MiB string', function() {
            expect(FireTPL.fn.byte('7098859')).to.eql('6.8 MiB');
        });

        it('Should convert size in a readable GiB string', function() {
            expect(FireTPL.fn.byte('10003021824')).to.eql('9.3 GiB');
        });

        it('Should convert size in a readable TiB string', function() {
            expect(FireTPL.fn.byte('23969353485516')).to.eql('21.8 TiB');
        });

        it('Should convert size in a readable PiB string', function() {
            expect(FireTPL.fn.byte('635345317431292700')).to.eql('564.3 PiB');
        });
    });
});