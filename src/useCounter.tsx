import { useEffect, useRef, useState } from "react";

const SKIP_COUNT = 5;
const MAX_HISTORY_ITEMS = 20;
const AUTO_DECREMENT_DELAY_MS = 2000;
const AUTO_DECREMENT_INTERVAL_MS = 1000;
const HOLD_INCREMENT_DELAY_MS = 300;
const HOLD_INCREMENT_INTERVAL_MS = 100;
const RESET_INTERVAL_MS = 100;

type Timer = ReturnType<typeof setTimeout>;
type TimerRef = { current: Timer | null };

const clearTimer = (timerRef: TimerRef) => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
};

export const useCounter = () => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    const autoDecrementInterval = useRef<Timer | null>(null);
    const autoDecrementTimeout = useRef<Timer | null>(null);
    const resetTimer = useRef<Timer | null>(null);
    const holdIncrementTimeout = useRef<Timer | null>(null);
    const holdIncrementInterval = useRef<Timer | null>(null);
    const incrementCount = useRef(0);

    useEffect(() => {
        return () => {
            clearTimer(autoDecrementInterval);
            clearTimer(autoDecrementTimeout);
            clearTimer(resetTimer);
            clearTimer(holdIncrementTimeout);
            clearTimer(holdIncrementInterval);
        };
    }, []);

    const addToHistory = (previousCount: number) => {
        setHistory(prevHistory => [
            ...prevHistory.slice(-(MAX_HISTORY_ITEMS - 1)),
            previousCount,
        ]);
    };

    const stopAutoDecrement = () => {
        clearTimer(autoDecrementInterval);
        clearTimer(autoDecrementTimeout);
    };

    const startAutoDecrement = () => {
        stopAutoDecrement();

        autoDecrementTimeout.current = setTimeout(() => {
            autoDecrementInterval.current = setInterval(() => {
                setCount(prevCount => {
                    if (prevCount <= 0) {
                        clearTimer(autoDecrementInterval);
                        return 0;
                    }

                    return prevCount - 1;
                });
            }, AUTO_DECREMENT_INTERVAL_MS);
        }, AUTO_DECREMENT_DELAY_MS);
    };

    const onCounterChange = () => {
        clearTimer(resetTimer);
        startAutoDecrement();
    };

    const updateCount = (getNextCount: (previousCount: number) => number) => {
        setCount(previousCount => {
            const nextCount = getNextCount(previousCount);

            if (nextCount !== previousCount) {
                addToHistory(previousCount);
            }

            return nextCount;
        });
    };

    const increment = () => {
        onCounterChange();
        incrementCount.current++;

        if (incrementCount.current === SKIP_COUNT) {
            updateCount(previousCount => previousCount + SKIP_COUNT);
            incrementCount.current = 0;
        } else {
            updateCount(previousCount => previousCount + 1);
        }
    };

    const onPressIn = () => {
        clearTimer(holdIncrementTimeout);
        clearTimer(holdIncrementInterval);

        increment();

        holdIncrementTimeout.current = setTimeout(() => {
            holdIncrementInterval.current = setInterval(() => {
                increment();
            }, HOLD_INCREMENT_INTERVAL_MS);
        }, HOLD_INCREMENT_DELAY_MS);
    };

    const onPressOut = () => {
        clearTimer(holdIncrementTimeout);
        clearTimer(holdIncrementInterval);
    };

    const decrement = () => {
        onCounterChange();
        updateCount(previousCount => Math.max(previousCount - 1, 0));
    };

    const reset = () => {
        stopAutoDecrement();
        clearTimer(resetTimer);
        setHistory([]);

        resetTimer.current = setInterval(() => {
            setCount(previousCount => {
                if (previousCount <= 0) {
                    clearTimer(resetTimer);
                    return 0;
                }

                return previousCount - 1;
            });
        }, RESET_INTERVAL_MS);
    };

    return { count, increment, decrement, reset, history, onPressIn, onPressOut };
};