# NativeModule Counter

This project contains a React Native counter screen implemented with a reusable `useCounter` hook. The UI is kept in `src/Counter.tsx`, while the counter behavior, state updates, history tracking, and timers are handled inside `src/useCounter.tsx`.

The project also has a TurboModule Codegen spec in `src/specs/NativeCounter.ts`. That spec defines the native API shape for a future native `Counter` TurboModule with `getState`, `increment`, `decrement`, and `reset` methods. The current screen still uses the JavaScript hook for state management.

## Counter UI

`src/Counter.tsx` renders the counter value and action buttons:

- The current count is shown at the top.
- The increment button is implemented with `Pressable`.
- `onPressIn` starts repeated increments while the button is held.
- `onPressOut` stops the repeated increment timer.
- The decrement and reset actions use regular React Native `Button` components.
- The history list is rendered inside a `ScrollView`.

The component does not own the counter state directly. It receives everything from `useCounter`, which keeps the UI simple and focused on rendering.

## How `useCounter` Works

`useCounter` is the main state-management hook for the counter feature. It exposes:

```ts
{
  count,
  increment,
  decrement,
  reset,
  history,
  onPressIn,
  onPressOut,
}
```

### State

The hook uses React state for values that should re-render the UI:

- `count`: the current counter value.
- `history`: an array of previous count values.

Whenever `count` or `history` changes, React re-renders `Counter.tsx` with the latest values.

### Refs

The hook uses refs for mutable values that should survive re-renders but should not trigger a re-render by themselves:

- `decrementTimerInterval`: stores the interval used for automatic decrementing.
- `decrementTimerTimeout`: stores the timeout that starts auto-decrementing after a delay.
- `resetTimer`: stores the interval used during reset.
- `incrementCount`: tracks how many times increment has been pressed.
- `incrementTimer`: stores the interval used while the increment button is held down.

Refs are used for timer IDs because changing a timer ID is not UI state. The UI only needs to update when `count` or `history` changes.

## Increment Logic

Calling `increment` first resets the auto-decrement timer through `onChangeCounter`.

Then the hook increments `incrementCount.current`. Every normal increment increases the counter by `1`. When the increment count reaches `SKIP_COUNT`, which is currently `5`, the counter jumps by `5` instead of `1`, and `incrementCount.current` is reset back to `0`.

Before updating the count, the previous count value is added to `history`.

## Long Press Increment

The increment button uses `onPressIn` and `onPressOut`:

- `onPressIn` starts an interval that calls `increment` every `100ms`.
- `onPressOut` clears that interval.

This creates the hold-to-increment behavior.

## Decrement Logic

Calling `decrement` also resets the auto-decrement timer through `onChangeCounter`.

If the current count is greater than `0`, the hook:

1. Adds the current count to `history`.
2. Decreases the count by `1`.

The counter is not allowed to go below `0`.

## Reset Logic

Calling `reset` clears the history immediately, then starts a timer that decreases the count every `2s` while the count is greater than `0`.

The reset timer ID is stored in `resetTimer.current`, so it can be cleared later when the hook unmounts.

## Auto-Decrement Timer

Every time the user changes the counter, `onChangeCounter` is called.

It does two things:

1. Clears the existing auto-decrement interval.
2. Starts a timeout that waits `2s`, then starts decrementing the counter every `1s`.

This means the counter waits for the user to stop interacting before it begins automatically counting down.

## History Management

The `history` array stores previous counter values before changes are applied.

`onAddHistory` appends the latest previous count to the history list. If the history gets longer than `20` items, it keeps only the latest entries by slicing the array before adding the new value.

The history state is updated immutably with a new array each time, which allows React to detect the change and re-render the history list.

## Cleanup

`useEffect` returns a cleanup function that clears active intervals when the hook unmounts:

- `decrementTimerInterval`
- `resetTimer`

This prevents background timers from continuing after the counter screen is removed.

## TurboModule Spec

`src/specs/NativeCounter.ts` defines the TypeScript contract for a native TurboModule named `Counter`.

It declares:

```ts
export interface Spec extends TurboModule {
  getState(): number;
  increment(): void;
  decrement(): voidk;
  reset(): void;
}
```

`package.json` also includes `codegenConfig`, which tells React Native Codegen where to find the spec and which Android package should contain the generated native module bindings.

At the moment, the hook is still managing the live counter state in JavaScript. The TurboModule spec is the contract needed to move the counter logic into native code later.
