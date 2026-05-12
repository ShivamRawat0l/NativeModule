package com.nativemodule

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CounterPackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == CounterModule.NAME) {
            CounterModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                    CounterModule.NAME to
                            ReactModuleInfo(
                                    CounterModule.NAME,
                                    CounterModule.NAME,
                                    false,
                                    false,
                                    false,
                                    true
                            )
            )
        }
    }
}
