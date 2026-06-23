package com.appsbean.typeai.keyboard

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class KeyboardSettingsPackage : BaseReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? {
    return when (name) {
      KeyboardSettingsModule.NAME -> KeyboardSettingsModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    val moduleInfo = ReactModuleInfo(
      KeyboardSettingsModule.NAME,
      KeyboardSettingsModule::class.java.name,
      false,
      false,
      false,
      false,
    )

    return ReactModuleInfoProvider {
      mapOf(KeyboardSettingsModule.NAME to moduleInfo)
    }
  }
}
