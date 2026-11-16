import CoreHaptics
import ExpoModulesCore
import UIKit

public class ScanFeedbackExpoModule: Module {
  private var hapticEngine: CHHapticEngine?

  public func definition() -> ModuleDefinition {
    Name("ScanFeedbackExpo")

    Function("getDeviceModel") { () -> String in
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

    AsyncFunction("vibrate") { (durationMs: Double) in
      guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
        await MainActor.run {
          UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        }
        return
      }
      let engine = try self.hapticEngine ?? CHHapticEngine()
      self.hapticEngine = engine
      try await engine.start()
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
    }
  }
}
