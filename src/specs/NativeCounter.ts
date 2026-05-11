import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    getState(): number;
    increment(): void;
    decrement(): void;
    reset(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Counter');
