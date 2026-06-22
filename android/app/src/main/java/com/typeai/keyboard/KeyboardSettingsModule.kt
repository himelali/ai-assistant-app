package com.typeai.keyboard

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.view.inputmethod.InputMethodManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = KeyboardSettingsModule.NAME)
class KeyboardSettingsModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  companion object {
    const val NAME = "KeyboardSettings"
  }

  @ReactMethod
  fun openKeyboardSettings(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_INPUT_METHOD_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("keyboard_settings_error", error)
    }
  }

  @ReactMethod
  fun showKeyboardPicker(promise: Promise) {
    try {
      val inputMethodManager =
        reactContext.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
      inputMethodManager.showInputMethodPicker()
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("keyboard_picker_error", error)
    }
  }

  @ReactMethod
  fun isTypeAiKeyboardEnabled(promise: Promise) {
    try {
      val enabledInputMethods = Settings.Secure.getString(
        reactContext.contentResolver,
        Settings.Secure.ENABLED_INPUT_METHODS,
      ).orEmpty()
      promise.resolve(enabledInputMethods.contains("${reactContext.packageName}/"))
    } catch (error: Exception) {
      promise.reject("keyboard_status_error", error)
    }
  }
}
