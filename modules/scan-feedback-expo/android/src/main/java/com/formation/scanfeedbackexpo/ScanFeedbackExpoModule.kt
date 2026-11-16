package com.formation.scanfeedbackexpo

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScanFeedbackExpoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ScanFeedbackExpo")

    Function("getDeviceModel") {
      "${Build.MANUFACTURER} ${Build.MODEL}"
    }

    AsyncFunction("vibrate") { durationMs: Long ->
      val vibrator = appContext.reactContext!!.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      vibrator.vibrate(
        VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE)
      )
    }
  }
}
