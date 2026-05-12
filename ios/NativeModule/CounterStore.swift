import Foundation

@objc(CounterStore)
class CounterStore: NSObject {
  private var count = 0
  private var incrementPressCount = 0
  private let skipCount = 5

  @objc
  func getState() -> NSNumber {
    return NSNumber(value: count)
  }

  @objc
  func increment() -> NSNumber {
    incrementPressCount += 1

    if incrementPressCount == skipCount {
      count += skipCount
      incrementPressCount = 0
    } else {
      count += 1
    }

    return NSNumber(value: count)
  }

  @objc
  func decrement() -> NSNumber {
    if count > 0 {
      count -= 1
    }

    return NSNumber(value: count)
  }

  @objc
  func reset() -> NSNumber {
    count = 0
    incrementPressCount = 0
    return NSNumber(value: count)
  }
}
