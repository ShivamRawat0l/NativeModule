#import "Counter.h"
#import <React_RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import "NativeModule-Swift.h"

@implementation Counter {
  CounterStore *_store;
}

RCT_EXPORT_MODULE(Counter)

- (instancetype)init
{
  self = [super init];
  if (self) {
    _store = [CounterStore new];
  }
  return self;
}

- (NSNumber *)getState
{
  return [_store getState];
}

- (NSNumber *)increment
{
  return [_store increment];
}

- (NSNumber *)decrement
{
  return [_store decrement];
}

- (NSNumber *)reset
{
  return [_store reset];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeCounterSpecJSI>(params);
}

@end
