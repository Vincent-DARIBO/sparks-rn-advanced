import CoreHaptics
import Foundation
import UIKit

@objc(ScanFeedbackImpl)
public class ScanFeedbackImpl: NSObject {
  private static var hapticEngine: CHHapticEngine?

  @objc public static func deviceModel() -> String {
    if let simulatorModel = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] {
      return "Apple \(simulatorModel)"
    }
    var systemInfo = utsname()
    uname(&systemInfo)
    let identifier = withUnsafePointer(to: &systemInfo.machine) {
      $0.withMemoryRebound(to: CChar.self, capacity: Int(_SYS_NAMELEN)) {
        String(cString: $0)
      }
    }
    return "Apple \(identifier)"
  }

  @objc public static func vibrate(
    durationMs: Double,
    completion: @escaping (NSError?) -> Void
  ) {
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
      UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
      completion(nil)
      return
    }
    do {
      let engine = try hapticEngine ?? CHHapticEngine()
      hapticEngine = engine
      try engine.start()
      let event = CHHapticEvent(
        eventType: .hapticContinuous,
        parameters: [
          CHHapticEventParameter(parameterID: .hapticIntensity, value: 1.0),
          CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5),
        ],
        relativeTime: 0,
        duration: durationMs / 1000.0
      )
      let pattern = try CHHapticPattern(events: [event], parameters: [])
      let player = try engine.makePlayer(with: pattern)
      try player.start(atTime: CHHapticTimeImmediate)
      completion(nil)
    } catch {
      completion(error as NSError)
    }
  }
}
