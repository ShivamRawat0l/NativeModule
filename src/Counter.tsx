import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useCounter } from './useCounter';

function Counter() {
    const { count, decrement, reset, history, onPressIn, onPressOut } = useCounter();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.text}>{count}</Text>
                    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}  >
                        <Text style={styles.button}>Increment</Text>
                    </Pressable >
                    <Button title="Decrement" onPress={decrement} />
                    <Button title="Reset" onPress={reset} />
                    <Text style={styles.text}>History</Text>
                    <View style={styles.historyContainer}>
                        <ScrollView contentContainerStyle={styles.scrollView}>
                            {history.map((item, index) => (
                                <Text key={index} >{item}</Text>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        fontSize: 20,
        textAlign: 'center',
        color: 'skyblue'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        padding: 10,
    },
    historyContainer: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    scrollView: {
        flexDirection: 'column-reverse',
    },
});

export default Counter;
