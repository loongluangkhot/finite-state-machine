/* 
Source: https://statecharts.dev/what-is-a-state-machine.html
An abstract state machine is a software component that defines a finite set of states:

One state is defined as the initial state. When a machine starts to execute, it automatically enters this state.
Each state can define actions that occur when a machine enters or exits that state. Actions will typically have side effects.
Each state can define events that trigger a transition.
A transition defines how a machine would react to the event, by exiting one state and entering another state.
A transition can define actions that occur when the transition happens. Actions will typically have side effects.
When “running” a state machine, this abstract state machine is executed.  The first thing that happens is that the state machine enters the “initial state”.  Then, events are passed to the machine as soon as they happen.  When an event happens:

The event is checked against the current state’s transitions.
If a transition matches the event, that transition “happens”.
By virtue of a transition “happening”, states are exited, and entered and the relevant actions are performed
The machine immediately is in the new state, ready to process the next event.
 */

class FiniteStateMachine {
  constructor(instruction) {
    this._instruction = instruction;
    this._state = this._instruction.initialState;
  }

  get value() {
    return this._state;
  }

  exit(state) {
    const stateDef = this._instruction.states[state];
    stateDef.actions.exit();
    return true;
  }

  transit(state, event) {
    const stateDef = this._instruction.states[state];
    const transitionDef = stateDef.events[event];
    if (!transitionDef) {
      return false;
    }
    transitionDef.action();
    return transitionDef.target;
  }

  enter(state) {
    const stateDef = this._instruction.states[state];
    stateDef.actions.entry();
    return true;
  }

  transition(state, event) {
    const target = this.transit(state, event);
    if (!target) {
      return this._state;
    }
    this.exit(state);
    this.enter(target);
    this._state = target;
    return this._state;
  }
}

const createMachine = (instruction) => new FiniteStateMachine(instruction);

const machine = createMachine({
  initialState: "off",
  states: {
    on: {
      actions: {
        entry() {},
        exit() {},
      },
      events: {
        switch: {
          target: "off",
          action() {},
        },
      },
    },
    off: {
      actions: {
        entry() {},
        exit() {},
      },
      events: {
        switch: {
          target: "on",
          action() {},
        },
      },
    },
  },
});

let state = machine.value;
console.log(`current state: ${state}`);
state = machine.transition(state, "switch");
console.log(`current state: ${state}`);
state = machine.transition(state, "switch");
console.log(`current state: ${state}`);
