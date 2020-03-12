describe('Comparsion Functions', function() {
    'use strict';
    
    describe('Function gt()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.gt).to.be.a('function');
        });

        it('Should compare two numbers', function() {
            expect(FireTPL.fn.gt('328', '300')).to.be(true);
        });

        it('Should fail a comparsion with a string', function() {
            expect(FireTPL.fn.gt('three', '300')).to.be(false);
        });

        it('Should fail a comparsion with a lower number', function() {
            expect(FireTPL.fn.gt(200, '300')).to.be(false);
        });

        it('Should fail a comparsion with equal numbers', function() {
            expect(FireTPL.fn.gt(300, '300')).to.be(false);
        });
    });

    describe('Function gte()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.gte).to.be.a('function');
        });

        it('Should compare two numbers', function() {
            expect(FireTPL.fn.gte('328', '300')).to.be(true);
        });

        it('Should fail a comparsion with a string', function() {
            expect(FireTPL.fn.gte('three', '300')).to.be(false);
        });

        it('Should fail a comparsion with a lower number', function() {
            expect(FireTPL.fn.gte(200, '300')).to.be(false);
        });

        it('Should fail a comparsion with equal numbers', function() {
            expect(FireTPL.fn.gte(300, '300')).to.be(true);
        });
    });

    describe('Function lt()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.lt).to.be.a('function');
        });

        it('Should compare two numbers', function() {
            expect(FireTPL.fn.lt('228', '300')).to.be(true);
        });

        it('Should fail a comparsion with a string', function() {
            expect(FireTPL.fn.lt('three', '300')).to.be(false);
        });

        it('Should fail a comparsion with a lower number', function() {
            expect(FireTPL.fn.lt(400, '300')).to.be(false);
        });

        it('Should fail a comparsion with equal numbers', function() {
            expect(FireTPL.fn.lt(300, '300')).to.be(false);
        });
    });

    describe('Function lte()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.lte).to.be.a('function');
        });

        it('Should compare two numbers', function() {
            expect(FireTPL.fn.lte('228', '300')).to.be(true);
        });

        it('Should fail a comparsion with a string', function() {
            expect(FireTPL.fn.lte('three', '300')).to.be(false);
        });

        it('Should fail a comparsion with a lower number', function() {
            expect(FireTPL.fn.lte(400, '300')).to.be(false);
        });

        it('Should fail a comparsion with equal numbers', function() {
            expect(FireTPL.fn.lte(300, '300')).to.be(true);
        });
    });

    describe('Function if()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.if).to.be.a('function');
        });

        it('Should return a true value if instr is same like comparison', function() {
            expect(FireTPL.fn.if('yes', 'yes', 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is not same like comparison', function() {
            expect(FireTPL.fn.if('yes', 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is undefined', function() {
            expect(FireTPL.fn.if(undefined, 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is null', function() {
            expect(FireTPL.fn.if(null, 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is an empty str', function() {
            expect(FireTPL.fn.if('', 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is number 0', function() {
            expect(FireTPL.fn.if(0, 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is false', function() {
            expect(FireTPL.fn.if(false, 'no', 'Yes', 'No')).to.be('No');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.if(true, true, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.if(1, '1', 'Yes', 'No')).to.be('Yes');
        });
    });

    describe('Function ifTrue()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.ifTrue).to.be.a('function');
        });

        it('Should return a true value if instr is a string', function() {
            expect(FireTPL.fn.ifTrue('yes', 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is undefined', function() {
            expect(FireTPL.fn.ifTrue(undefined, 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is null', function() {
            expect(FireTPL.fn.ifTrue(null, 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is an empty str', function() {
            expect(FireTPL.fn.ifTrue('', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is number 0', function() {
            expect(FireTPL.fn.ifTrue(0, 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is false', function() {
            expect(FireTPL.fn.ifTrue(false, 'Yes', 'No')).to.be('No');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifTrue(true, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifTrue(1, 'Yes', 'No')).to.be('Yes');
        });
    });

    describe('Function ifTrue(), one arg', function() {
        it('Should return a true value if instr is a string', function() {
            expect(FireTPL.fn.ifTrue('Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is undefined', function() {
            expect(FireTPL.fn.ifTrue(undefined, 'No')).to.be('No');
        });

        it('Should return a false value if instr is null', function() {
            expect(FireTPL.fn.ifTrue(null, 'No')).to.be('No');
        });

        it('Should return a false value if instr is an empty str', function() {
            expect(FireTPL.fn.ifTrue('', 'No')).to.be('No');
        });

        it('Should return a false value if instr is number 0', function() {
            expect(FireTPL.fn.ifTrue(0, 'No')).to.be('No');
        });

        it('Should return a false value if instr is false', function() {
            expect(FireTPL.fn.ifTrue(false, 'No')).to.be('No');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifTrue(true, 'No')).to.be(true);
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifTrue(1, 'No')).to.be(1);
        });
    });

    describe('Function ifFalse()', function() {
        it('Should be a function', function() {
            expect(FireTPL.fn.ifFalse).to.be.a('function');
        });

        it('Should return a true value if instr is a string', function() {
            expect(FireTPL.fn.ifFalse('yes', 'Yes', 'No')).to.be('No');
        });

        it('Should return a false value if instr is undefined', function() {
            expect(FireTPL.fn.ifFalse(undefined, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is null', function() {
            expect(FireTPL.fn.ifFalse(null, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is an empty str', function() {
            expect(FireTPL.fn.ifFalse('', 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is number 0', function() {
            expect(FireTPL.fn.ifFalse(0, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is false', function() {
            expect(FireTPL.fn.ifFalse(false, 'Yes', 'No')).to.be('Yes');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifFalse(true, 'Yes', 'No')).to.be('No');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifFalse(1, 'Yes', 'No')).to.be('No');
        });
    });

    describe('Function ifFalse() one arg', function() {
        it('Should return a true value if instr is a string', function() {
            expect(FireTPL.fn.ifFalse('Yes', 'No')).to.be('Yes');
        });

        it('Should return a false value if instr is undefined', function() {
            expect(FireTPL.fn.ifFalse(undefined, 'Yes')).to.be('Yes');
        });

        it('Should return a false value if instr is null', function() {
            expect(FireTPL.fn.ifFalse(null, 'Yes')).to.be('Yes');
        });

        it('Should return a false value if instr is an empty str', function() {
            expect(FireTPL.fn.ifFalse('', 'Yes')).to.be('Yes');
        });

        it('Should return a false value if instr is number 0', function() {
            expect(FireTPL.fn.ifFalse(0, 'Yes')).to.be('Yes');
        });

        it('Should return a false value if instr is false', function() {
            expect(FireTPL.fn.ifFalse(false, 'Yes')).to.be('Yes');
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifFalse(true, 'No')).to.be(true);
        });

        it('Should return a true value if instr is true', function() {
            expect(FireTPL.fn.ifFalse(1, 'No')).to.be(1);
        });
    });
});