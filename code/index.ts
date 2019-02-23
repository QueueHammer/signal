import { ChildProcess } from "child_process";

export class Signal {
  private proc: NodeJS.Process;
  private onTerm: iSignalCallback;
  private onIgn: iSignalCallback;
  private onCore: iSignalCallback;

  constructor({onTerm, onIgn, onCore, proc}: iSignalConfig = {}) {
    this.proc = proc || process;
    this.onTerm = onTerm || (() => undefined);
    this.onCore = onCore || (() => undefined);
    this.onIgn = onIgn || (() => undefined);

    Object.keys(POSIXSignal)
      .filter(x => !/^\d+/.test(x))
      .map(str => <unknown>str as POSIXSignal) 
      .map(signal => {
        var action = <unknown>POSIXSignal[signal] as Action;
        var actionCbk: iSignalCallback;
        var noop = () => {};

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

        if(actionCbk == noop) { return; }
        this.proc.on(<unknown>signal as NodeJS.Signals, actionCbk);
      })
  }
}

export interface iSignalConfig {
  onTerm?: iSignalCallback,
  onIgn?: iSignalCallback,
  onCore?: iSignalCallback,
  proc?: NodeJS.Process
}

export interface iSignalCallback {
  (signal?: string): void
}

export enum Action {
  Term,
  Ign,
  Core,
  Stop,
  Cont,
  NodeUncaught,
  NodeInvalid,
}

export enum POSIXSignal {
  SIGHUP = Action.Term,
  SIGINT = Action.Term,
  SIGQUIT = Action.Core,
  SIGILL = Action.Core,
  SIGABRT = Action.Core,
  SIGFPE = Action.Core,
  SIGKILL = Action.NodeInvalid,
  SIGSEGV = Action.Core,
  SIGPIPE = Action.Ign,
  SIGALRM = Action.Term,
  SIGTERM = Action.Term,
  SIGUSR1 = Action.NodeInvalid,
  SIGUSR2 = Action.Term,
  SIGCHLD = Action.Ign,
  SIGCONT = Action.Cont,
  SIGSTOP = Action.NodeInvalid,
  SIGTSTP = Action.Stop,
  SIGTTIN = Action.Stop,
  SIGTTOU = Action.Stop,
  SIGBREAK = Action.Ign,
  SIGBUS = Action.Core,
}