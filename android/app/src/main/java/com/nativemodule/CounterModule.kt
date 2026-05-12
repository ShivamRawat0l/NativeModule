package com.nativemodule

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = CounterModule.NAME)
class CounterModule(
  reactContext: ReactApplicationContext
) : NativeCounterSpec(reactContext) {

  private var count = 0
  private var incrementPressCount = 0

  override fun getName(): String = NAME

  override fun getState(): Double {
    return count.toDouble()
  }

  override fun increment(): Double {
    incrementPressCount += 1

    if (incrementPressCount == SKIP_COUNT) {
      count += SKIP_COUNT
      incrementPressCount = 0
    } else {
      count += 1
    }

    return count.toDouble()
  }

  override fun decrement(): Double {
    if (count > 0) {
      count -= 1
    }

    return count.toDouble()
  }

  override fun reset(): Double {
    count = 0
    incrementPressCount = 0
    return count.toDouble()
  }

  companion object {
    const val NAME = "Counter"
    private const val SKIP_COUNT = 5
  }
}