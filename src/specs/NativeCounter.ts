import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    getState(): number;
    increment(): number;
    decrement(): number;
    reset(): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Counter');
