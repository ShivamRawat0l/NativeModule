import { useEffect, useRef, useState } from "react";

const SKIP_COUNT = 5;

export const useCounter = () => {
    const [count, setCount] = useState(0);
    const [history, setHistory] = useState<number[]>([]);
    const decrementTimerInterval = useRef(0);
    const decrementTimerTimeout = useRef(0);
    const resetTimer = useRef(0);
    const incrementCount = useRef(0);

    useEffect(() => {
        return () => {
            clearInterval(decrementTimerInterval.current);
            clearInterval(resetTimer.current);
        }
    }, []);

    const removeDecrementTimer = () => {
        clearInterval(decrementTimerInterval.current);
    }

    const addDecrementTimer = () => {
        decrementTimerInterval.current = setInterval(() => {
            if (count > 0) {
                setCount(count - 1);
            } else {
                clearInterval(decrementTimerInterval.current);
            }
        }, 1000);
    }

    const onChangeCounter = () => {
        removeDecrementTimer();
        clearTimeout(decrementTimerTimeout.current);
        decrementTimerTimeout.current = setTimeout(() => {
            addDecrementTimer();
        }, 2000);
    }

    const onAddHistory = (count: number) => {
        setHistory(prevHistory => {
            if (prevHistory.length > 20) {
                return [...prevHistory.slice(-20), count];
            } else {
                return [...prevHistory, count];
            }
        });
    }

    const increment = () => {
        console.log('increment');
        onChangeCounter();
        incrementCount.current++;
        if (incrementCount.current === SKIP_COUNT) {
            setCount(prevCount => {
                onAddHistory(prevCount);
                return prevCount + SKIP_COUNT;
            });
            incrementCount.current = 0;
        } else {
            setCount(prevCount => {
                onAddHistory(prevCount);
                return prevCount + 1;
            });
        }
    }

    let incrementTimer = useRef(0);

    const onPressIn = () => {
        clearInterval(incrementTimer.current);
        incrementTimer.current = setInterval(() => increment(), 100);
    }

    const onPressOut = () => {
        clearInterval(incrementTimer.current);
    }

    const decrement = () => {
        onChangeCounter();
        if (count > 0) {
            setCount(prevCount => {
                onAddHistory(prevCount);
                return prevCount - 1;
            });
        }
    }

    const reset = () => {
        onChangeCounter();
        setHistory([]);
        resetTimer.current = setInterval(() => {
            if (count > 0) {
                setCount(count - 1);
            }
        }, 2000);
    }

    return { count, increment, decrement, reset, history, onPressIn, onPressOut };
}