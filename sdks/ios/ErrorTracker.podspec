Pod::Spec.new do |spec|
  spec.name         = "ErrorTracker"
  spec.version      = "1.0.0"
  spec.summary      = "iOS SDK for Error Management Platform"
  spec.description  = <<-DESC
    Error Tracker SDK for iOS. Automatically captures errors and sends them to your backend.
  DESC

  spec.homepage     = "https://github.com/yourorg/error-tracker"
  spec.license      = { :type => "MIT", :file => "LICENSE" }
  spec.author       = { "" => "" }
  
  spec.platform     = :ios, "13.0"
  spec.swift_version = "5.0"

  spec.source       = { :git => "https://github.com/yourorg/error-tracker.git", :tag => "#{spec.version}" }
  spec.source_files = "ErrorTracker/**/*.{swift}"
  
  spec.dependency "Alamofire", "~> 5.8"
end

