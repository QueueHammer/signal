import 'mocha';
import { should } from 'chai';
import sinon from 'sinon';
import { Signal, iSignalCallback, POSIXSignal, Action } from './index';

should();

describe('When registering signal handlers', () => {
  var timeout = 10;
  var keys = Object.keys(POSIXSignal)
    .filter(signalName => !/^\d/.test(signalName))
    .forEach(signalName => {
      var action = (<any>POSIXSignal)[signalName];
      describe(`A ${signalName} signal is fired`, () => {
        const config: {
          onIgn: sinon.SinonSpy,
          onTerm: sinon.SinonSpy,
          onCore: sinon.SinonSpy,
          proc: iMockProc
        } = <any>{};

        const handledActions = [Action.Term, Action.Core, Action.Ign];
        var shouldBeBound: boolean = handledActions.includes(action);
        var threw = false;
        var isCore = action == Action.Core;

        var boundEvent: sinon.SinonSpyCall;

        beforeEach(() => {
          config.onIgn = sinon.fake();
          config.onTerm = sinon.fake();
          config.onCore = sinon.fake();
          config.proc = mockProc();
          new Signal(<any>config);
          shouldBeBound = handledActions.includes(action);
          boundEvent = getCallback(config.proc, signalName);
          threw = boundEvent ? callAndCatchThrow(boundEvent.args[1], signalName): false;
          isCore = action == Action.Core;
        });

        it(`Should${shouldBeBound ? '': ' not'} have registered a callback`, after(() => {
          var be = (boundEvent !== undefined).should.be;
          shouldBeBound ?
            be.true:
            be.false;
        }));

        it(`Should${isCore ? '': ' not'} throw an exception`, after(() => {
          var be = threw.should.be;
          isCore ?
            be.true:
            be.false;
        }));

        handledActions.forEach((targetAction) => {
            var isThisAction = action == targetAction;
            var actionName = Action[targetAction];
            it(`A ${actionName} handler should${isThisAction ? '': ' not'} be called`, (done) => {

              setTimeout(() => {
                var index = `on${actionName}`;
                var be = (<any>config)[index].called.should.be;
                isThisAction ?
                  be.true :
                  be.not.true
                done();
              }, timeout);
            });
          });
      });
  });

  function after(cb: () => void) {
    return (done: () => void) => {
      setTimeout(() => {
        cb();
        done();
      }, timeout);
    };
  }
});


function getCallback(proc: iMockProc, signal: string) {
  return proc.on.getCalls().filter(call => call.args[0] == signal)[0];
} 

function callAndCatchThrow(callback: iSignalCallback, signal: string) {
  var hasThrown = false;

  try {
    callback(signal);
  } catch (error) {
    hasThrown = true;
  }

  return hasThrown;
}

function mockProc() {
  return {
    on: sinon.fake(),
    exit: sinon.fake()
  };
}

interface iMockProc {
  on: sinon.SinonSpy,
  exit: sinon.SinonSpy
}