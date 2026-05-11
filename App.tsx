import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const SKIP_COUNT = 5;

function App() {
    const [count, setCount] = useState(0);
    const incrementCount = useRef(0)

    const increment = () => {
        incrementCount.current++;
        if (incrementCount.current === SKIP_COUNT) {
            setCount(prevCount => prevCount + SKIP_COUNT);
            incrementCount.current = 0;
        } else {
            setCount(count + 1);
        }
    }

    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    }

    const reset = () => {
        setCount(0);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.text}>{count}</Text>
                    <Button title="Increment" onPress={increment} />
                    <Button title="Decrement" onPress={decrement} />
                    <Button title="Reset" onPress={reset} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default App;
