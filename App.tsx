import { SafeAreaProvider } from 'react-native-safe-area-context';
import Counter from './src/Counter';

function App() {
    return (
        <SafeAreaProvider>
            <Counter />
        </SafeAreaProvider>
    );
}

export default App;
