# Signal

## TLDR;
Use standard handlers to respond to the multitude of system signals.
```javascript
new Signal({
  // Shutdown express, and it's about time, literally.
  // We were just signaled
  onTerm: () => expressApp.close()
});
```

Three callbacks are provided (Maybe more in the future); `onTerm`, `onCore`, and `onIgn`. This gives you a little more control over how they are handled. `Stop` and `Cont`inue are caught by Node.js, so they are not provided.

Suggestions on how you can try to handel these errors come from the [`signal(7)`][1] man page...
| Category | General Response |
|--|--|
| Term | Default action is to terminate the process. |
| Ign | Default action is to ignore the signal. |
| Core | Default action is to terminate the process and dump core (see [`core(5)`][2]). |

## Slightly More Copy
Things happen, systems send signals to your app, and whether or not your listening to them they expect things to happen. Sometimes this means letting you stop something you started gracefully. It could be you just want it to shutdown faster when the time comes. So your not waiting for your Docker containers for the full timeout every time. It's only 10 seconds, but imagine that hundreds of times. The standard signals have standard responses and this library lets you set a callback for the ones we can handle.

## Caviots in Node
- `SIGUSR1` is reserved by Node.js to start the debugger. They say this causes problems so it's ignored
- `SIGTERM` and `SIGINT` have default handlers, but i've noticed they dont seem to stop express, so you should use the `Term` handler to do that or kill other processes you have started. Once you do... you still need to shutdown the app like the original handler would. Maybe not a surprise here, this library does that for you.
- `SIGHUP` is `SIGTERM` for Windows.
- `SIGTERM` is not supported on Windows, it can be listened on, so it gets another footnote.
- `SIGBREAK` not in the original POSIX set, cause windows, but is delivered on Windows when <Ctrl>+<Break> is pressed, on non-Windows platforms it can be listened on, but there is no way to send or generate it. A listener is created, and it's grouped under the `Ign` handler.
- `SIGWINCH` also no in the original POSIX is delivered when the console has been resized. On Windows, this will only happen on write to the console when the cursor is being moved, or when a readable tty is used in raw mode.
- `SIGKILL` Adding a listener will cause a runtime error in newer version of Node.js so this library does not do that.
- `SIGSTOP` like `SIGKILL`.
- `SIGBUS`, `SIGFPE`, `SIGSEGV` and `SIGILL`, when not raised artificially using kill(2), inherently leave the process in a state from which it is not safe to attempt to call JS listeners. Doing so might lead to the process hanging in an endless loop, since listeners attached using process.on() are called asynchronously and therefore unable to correct the underlying problem.


## Signal - [Overview of Signals][1]
Good additional reading on the signals that exist, just not the windows ones.

| Signal | Value | Action | Comment |
|-|-|-|-|
| SIGHUP | 1 | Term | Hangup detected on controlling terminal or death of controlling process |
| SIGINT | 2 | Term | Interrupt from keyboard |
| SIGQUIT | 3 | Core | Quit from keyboard |
| SIGILL | 4 | Core | Illegal Instruction |
| SIGABRT | 6 | Core | Abort signal from abort(3) |
| SIGFPE | 8 | Core | Floating-point exception |
| SIGKILL | 9 | Term | Kill signal |
| SIGSEGV | 11 | Core | Invalid memory reference |
| SIGPIPE | 13 | Term | Broken pipe: write to pipe with no readers; see pipe(7) |
| SIGALRM | 14 | Term | Timer signal from alarm(2) |
| SIGTERM | 15 | Term | Termination signal |
| SIGUSR1 | 30,10,16 | Term | User-defined signal 1 |
| SIGUSR2 | 31,12,17 | Term | User-defined signal 2 |
| SIGCHLD | 20,17,18 | Ign | Child stopped or terminated |
| SIGCONT | 19,18,25 | Cont | Continue if stopped |
| SIGSTOP | 17,19,23 | Stop | Stop process |
| SIGTSTP | 18,20,24 | Stop | Stop typed at terminal |
| SIGTTIN | 21,21,26 | Stop | Terminal input for background process |
| SIGTTOU | 22,22,27 | Stop | Terminal output for background process |


[1]:http://man7.org/linux/man-pages/man7/signal.7.html
[2]:http://man7.org/linux/man-pages/man5/core.5.html