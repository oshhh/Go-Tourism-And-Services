'use strict';

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let LogUtils = require('../lib/logUtils');

describe('Utils', function() {
  describe('timer', function() {
    let sandbox;
    let hrtimerStub;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      hrtimerStub = sandbox.stub(LogUtils, 'hrtime');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('Should return a timer object', function() {
      let timer = LogUtils.timer();
      inspect(timer).isObject();
    });

    let times = [];
    times.push([1, '1ns']);
    times.push([333, '333ns']);
    times.push([999, '999ns']);
    times.push([1000, '1μs']);
    times.push([333333, '333μs']);
    times.push([999999, '999μs']);
    times.push([1000000, '1ms']);
    times.push([333333333, '333ms']);
    times.push([999999999, '999ms']);
    times.push([1000000000, '1s']);
    times.push([333333333333, '333s']);
    times.push([999999999999, '999s']);

    for (let t of times) {
      it(`Should run a timer for ${t[1]}`, function() {
        let timer = LogUtils.timer();
        hrtimerStub.returns([0, t[0]]);

        inspect(timer.stop()).isEql(t[1]);
      });
    }

    it('Should handle multiple timers', function() {
      let timer1 = LogUtils.timer();
      let timer2 = LogUtils.timer();
      let timer3 = LogUtils.timer();

      inspect(timer1).isNotEqual(timer2);
      inspect(timer1).isNotEqual(timer3);
    });

    it('Should log current timer time', function() {
      let timer = LogUtils.timer();
      hrtimerStub.returns([0, 1]);
      hrtimerStub.onCall(1).returns([0, 111]);
      hrtimerStub.onCall(2).returns([0, 222]);
      hrtimerStub.onCall(3).returns([0, 333]);

      inspect(timer.log()).isEql('111ns');
      inspect(timer.log()).isEql('222ns');
      inspect(timer.log()).isEql('333ns');
    });

  });
});
