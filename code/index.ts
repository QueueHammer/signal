import { ChildProcess } from "child_process";

export default class Signal {
  private actions: SignalActions;

  constructor(private proc: NodeJS.Process = process) {
    proc.on(POSIXSignal.SIGHUP, this.onTerm);
    proc.on(POSIXSignal.SIGINT, this.onTerm);
    proc.on(POSIXSignal.SIGQUIT, this.onCore);
    proc.on(POSIXSignal.SIGILL, this.onCore);
    proc.on(POSIXSignal.SIGABRT, this.onCore);
    proc.on(POSIXSignal.SIGFPE, this.onCore);
    proc.on(POSIXSignal.SIGKILL, this.onTerm);
    proc.on(POSIXSignal.SIGSEGV, this.onCore);
    proc.on(POSIXSignal.SIGPIPE, this.onTerm);
    proc.on(POSIXSignal.SIGALRM, this.onTerm);
    proc.on(POSIXSignal.SIGTERM, this.onTerm);
    proc.on(POSIXSignal.SIGUSR1, this.onTerm);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
    proc.on(POSIXSignal.SIGCHLD, this.onIgn);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
    proc.on(POSIXSignal.SIGUSR2, this.onTerm);
  }

  private onTerm () {
    
  }

  private onIgn () {
    
  }

  private onCore () {
    
  }

  private onStop () {
    
  }

  private onCont () {
    
  }
}

type SignalActions = {
  [P in keyof SignalAction]: () => void;
};

export enum SignalAction {
  Term = 'Term',
  Ign = 'Ign',
  Core = 'Core',
  Stop = 'Stop',
  Cont = 'Cont',
}

export enum POSIXSignal {
  SIGHUP = 'SIGHUP',
  SIGINT = 'SIGINT',
  SIGQUIT = 'SIGQUIT',
  SIGILL = 'SIGILL',
  SIGABRT = 'SIGABRT',
  SIGFPE = 'SIGFPE',
  SIGKILL = 'SIGKILL',
  SIGSEGV = 'SIGSEGV',
  SIGPIPE = 'SIGPIPE',
  SIGALRM = 'SIGALRM',
  SIGTERM = 'SIGTERM',
  SIGUSR1 = 'SIGUSR1',
  SIGUSR2 = 'SIGUSR2',
  SIGCHLD = 'SIGCHLD',
  SIGCONT = 'SIGCONT',
  SIGSTOP = 'SIGSTOP',
  SIGTSTP = 'SIGTSTP',
  SIGTTIN = 'SIGTTIN',
  SIGTTOU = 'SIGTTOU',
}