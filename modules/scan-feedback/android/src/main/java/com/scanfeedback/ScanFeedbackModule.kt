package com.scanfeedback

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class ScanFeedbackModule(reactContext: ReactApplicationContext) :
  NativeScanFeedbackSpec(reactContext) {

  override fun getName() = NAME

  override fun vibrate(durationMs: Int, promise: Promise) {
    try {
      val vibrator = reactApplicationContext.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      vibrator.vibrate(
        VibrationEffect.createOneShot(durationMs.toLong(), VibrationEffect.DEFAULT_AMPLITUDE)
      )
      promise.resolve(null)
    } catch (error: SecurityException) {
      Log.e(NAME, "vibrate failed", error)
      promise.reject("vibration_failed", error)
    }
  }

  override fun getDeviceModel(): String = "${Build.MANUFACTURER} ${Build.MODEL}"

  companion object {
    const val NAME = "ScanFeedbackModule"
  }
}
