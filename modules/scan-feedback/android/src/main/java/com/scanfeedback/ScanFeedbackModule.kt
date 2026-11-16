package com.scanfeedback

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class ScanFeedbackModule(reactContext: ReactApplicationContext) :
  NativeScanFeedbackSpec(reactContext) {

  override fun getName() = NAME

  override fun vibrate(durationMs: Double, promise: Promise) {
    val vibrator = reactApplicationContext.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    vibrator.vibrate(
      VibrationEffect.createOneShot(durationMs.toLong(), VibrationEffect.DEFAULT_AMPLITUDE)
    )
    promise.resolve(null)
  }

  override fun getDeviceModel(): String = "${Build.MANUFACTURER} ${Build.MODEL}"

  companion object {
    const val NAME = "ScanFeedback"
  }
}
