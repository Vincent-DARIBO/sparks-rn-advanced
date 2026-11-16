#import "ScanFeedback.h"
#import "ScanFeedback-Swift.h"

@implementation ScanFeedback

- (void)vibrate:(double)durationMs
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject
{
  [ScanFeedbackImpl vibrateWithDurationMs:durationMs
                               completion:^(NSError *error) {
                                 if (error) {
                                   reject(@"vibration_failed", error.localizedDescription, error);
                                 } else {
                                   resolve(nil);
                                 }
                               }];
}

- (NSString *)getDeviceModel
{
  return [ScanFeedbackImpl deviceModel];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeScanFeedbackSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ScanFeedback";
}

@end
