Pod::Spec.new do |s|
  s.name           = 'ScanFeedbackExpo'
  s.version        = '1.0.0'
  s.summary        = 'Retour haptique et modele de l appareil pour ShelfScan'
  s.description    = 'Expo Module ScanFeedback'
  s.author         = 'Formation'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
