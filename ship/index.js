"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Signal {
    constructor({ onTerm, onIgn, onCore, proc } = {}) {
        this.proc = proc || process;
        this.onTerm = onTerm || (() => undefined);
        this.onCore = onCore || (() => undefined);
        this.onIgn = onIgn || (() => undefined);
        Object.keys(POSIXSignal)
            .filter(x => !/^\d+/.test(x))
            .map(str => str)
            .map(signal => {
            var action = POSIXSignal[signal];
            var actionCbk;
            var noop = () => { };
            switch (action) {
                case Action.Term:
                    actionCbk = (signalStr) => {
                        Promise.resolve(signalStr)
                            .then(this.onTerm)
                            .finally(() => this.proc.exit());
                    };
                    break;
                case Action.Core:
                    actionCbk = (signalStr) => {
                        this.onCore(signalStr);
                        throw new Error(`Process terminated via signal: ${signal}`);
                    };
                    break;
                case Action.Ign:
                    actionCbk = this.onIgn;
                    break;
                default:
                    actionCbk = noop;
                    break;
            }
            if (actionCbk == noop) {
                return;
            }
            this.proc.on(signal, actionCbk);
        });
    }
}
exports.Signal = Signal;
var Action;
(function (Action) {
    Action[Action["Term"] = 0] = "Term";
    Action[Action["Ign"] = 1] = "Ign";
    Action[Action["Core"] = 2] = "Core";
    Action[Action["Stop"] = 3] = "Stop";
    Action[Action["Cont"] = 4] = "Cont";
    Action[Action["NodeUncaught"] = 5] = "NodeUncaught";
    Action[Action["NodeInvalid"] = 6] = "NodeInvalid";
})(Action = exports.Action || (exports.Action = {}));
var POSIXSignal;
(function (POSIXSignal) {
    POSIXSignal[POSIXSignal["SIGHUP"] = 0] = "SIGHUP";
    POSIXSignal[POSIXSignal["SIGINT"] = 0] = "SIGINT";
    POSIXSignal[POSIXSignal["SIGQUIT"] = 2] = "SIGQUIT";
    POSIXSignal[POSIXSignal["SIGILL"] = 2] = "SIGILL";
    POSIXSignal[POSIXSignal["SIGABRT"] = 2] = "SIGABRT";
    POSIXSignal[POSIXSignal["SIGFPE"] = 2] = "SIGFPE";
    POSIXSignal[POSIXSignal["SIGKILL"] = 6] = "SIGKILL";
    POSIXSignal[POSIXSignal["SIGSEGV"] = 2] = "SIGSEGV";
    POSIXSignal[POSIXSignal["SIGPIPE"] = 1] = "SIGPIPE";
    POSIXSignal[POSIXSignal["SIGALRM"] = 0] = "SIGALRM";
    POSIXSignal[POSIXSignal["SIGTERM"] = 0] = "SIGTERM";
    POSIXSignal[POSIXSignal["SIGUSR1"] = 6] = "SIGUSR1";
    POSIXSignal[POSIXSignal["SIGUSR2"] = 0] = "SIGUSR2";
    POSIXSignal[POSIXSignal["SIGCHLD"] = 1] = "SIGCHLD";
    POSIXSignal[POSIXSignal["SIGCONT"] = 4] = "SIGCONT";
    POSIXSignal[POSIXSignal["SIGSTOP"] = 6] = "SIGSTOP";
    POSIXSignal[POSIXSignal["SIGTSTP"] = 3] = "SIGTSTP";
    POSIXSignal[POSIXSignal["SIGTTIN"] = 3] = "SIGTTIN";
    POSIXSignal[POSIXSignal["SIGTTOU"] = 3] = "SIGTTOU";
    POSIXSignal[POSIXSignal["SIGBREAK"] = 1] = "SIGBREAK";
    POSIXSignal[POSIXSignal["SIGBUS"] = 2] = "SIGBUS";
})(POSIXSignal = exports.POSIXSignal || (exports.POSIXSignal = {}));
//# sourceMappingURL=index.js.map