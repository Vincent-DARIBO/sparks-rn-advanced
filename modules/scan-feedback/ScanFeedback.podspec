require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ScanFeedback"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://example.com/shelfscan"
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => ".git", :tag => "v#{s.version}" }

  s.swift_version = "5.0"
  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.private_header_files = "ios/**/*.h"
  s.frameworks = "CoreHaptics", "UIKit"

  install_modules_dependencies(s)
end
