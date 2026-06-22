package com.typeai.keyboard

import android.content.ClipDescription
import android.content.ClipboardManager
import android.content.Context
import android.inputmethodservice.InputMethodService
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.inputmethod.InputConnection
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class TypeAiKeyboardService : InputMethodService() {
  private val classicBlue = Color.rgb(24, 58, 99)
  private val accentYellow = Color.rgb(242, 201, 76)
  private val lightGray = Color.rgb(232, 237, 243)
  private val surface = Color.WHITE
  private val ink = Color.rgb(20, 32, 51)
  private val mainHandler = Handler(Looper.getMainLooper())
  private var copiedContext = ""
  private var suggestedReply = "Copy a message, then tap Use Copy."
  private var suggestionStrip: TextView? = null

  override fun onCreateInputView(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(10, 10, 10, 10)
      setBackgroundColor(lightGray)
      addView(buildSuggestionStrip())
      addView(buildToolbar())
      addKeyboardRow("QWERTYUIOP")
      addKeyboardRow("ASDFGHJKL")
      addKeyboardRow("ZXCVBNM")
      addView(buildBottomRow())
    }
  }

  private fun buildSuggestionStrip(): View {
    return TextView(this).apply {
      suggestionStrip = this
      text = suggestionLabel()
      setTextColor(ink)
      textSize = 14f
      typeface = Typeface.DEFAULT_BOLD
      gravity = Gravity.CENTER_VERTICAL
      setPadding(14, 10, 14, 10)
      background = rounded(accentYellow, 14f)
      setOnClickListener {
        commitText(suggestedReply)
      }
    }
  }

  private fun buildToolbar(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      setPadding(0, 8, 0, 8)
      listOf(
        "Use Copy" to { loadCopiedContext() },
        "AI Reply" to { requestMockAiReply() },
        "Fix" to { commitText("I need this quickly.") },
        "Rewrite" to { commitText("Could you please prioritize this?") },
        "Voice" to { commitText("[Voice input placeholder]") }
      ).forEach { (label, action) ->
        addView(toolbarButton(label) { action() })
      }
    }
  }

  private fun loadCopiedContext() {
    val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    copiedContext = if (
      clipboard.hasPrimaryClip() &&
      clipboard.primaryClipDescription?.hasMimeType(ClipDescription.MIMETYPE_TEXT_PLAIN) == true
    ) {
      clipboard.primaryClip?.getItemAt(0)?.coerceToText(this)?.toString()?.trim().orEmpty()
    } else {
      ""
    }

    suggestedReply = if (copiedContext.isBlank()) {
      "Copy an incoming message first, then tap Use Copy."
    } else {
      "Copied context ready. Tap AI Reply."
    }
    updateSuggestionStrip()
  }

  private fun requestMockAiReply() {
    suggestedReply = "Requesting mock AI suggestion..."
    updateSuggestionStrip()

    mainHandler.postDelayed({
      suggestedReply = mockApiReply(copiedContext)
      updateSuggestionStrip()
    }, 700)
  }

  private fun mockApiReply(context: String): String {
    val text = context.lowercase()
    return when {
      context.isBlank() -> "Please copy the incoming message first."
      text.contains("report") -> "Sure, I will send the report shortly. Thanks for the reminder."
      text.contains("payment") || text.contains("milestone") -> "I will share the milestone update today and confirm once it is completed."
      text.contains("call") || text.contains("meeting") -> "Yes, the meeting is confirmed. I will join on time."
      else -> "Thanks for your message. I will review it and get back to you shortly."
    }
  }

  private fun suggestionLabel(): String = "Mock API suggestion: $suggestedReply"

  private fun updateSuggestionStrip() {
    suggestionStrip?.text = suggestionLabel()
  }

  private fun LinearLayout.addKeyboardRow(keys: String) {
    addView(LinearLayout(context).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      keys.forEach { key ->
        addView(keyButton(key.toString()) { commitText(key.toString().lowercase()) })
      }
    })
  }

  private fun buildBottomRow(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      addView(keyButton("123") { commitText("123") })
      addView(keyButton("space", weight = 3f) { commitText(" ") })
      addView(keyButton("⌫") { currentInputConnection?.deleteSurroundingText(1, 0) })
      addView(keyButton("↵") { currentInputConnection?.sendKeyEvent(android.view.KeyEvent(android.view.KeyEvent.ACTION_DOWN, android.view.KeyEvent.KEYCODE_ENTER)) })
    }
  }

  private fun toolbarButton(label: String, onClick: () -> Unit): View {
    return Button(this).apply {
      text = label
      textSize = 12f
      setTextColor(surface)
      background = rounded(classicBlue, 18f)
      setAllCaps(false)
      setOnClickListener { onClick() }
      layoutParams = LinearLayout.LayoutParams(0, 42, 1f).apply {
        setMargins(3, 0, 3, 0)
      }
    }
  }

  private fun keyButton(label: String, weight: Float = 1f, onClick: () -> Unit): View {
    return Button(this).apply {
      text = label
      textSize = if (label.length > 1) 12f else 16f
      setTextColor(ink)
      background = rounded(surface, 10f)
      setAllCaps(false)
      setOnClickListener { onClick() }
      layoutParams = LinearLayout.LayoutParams(0, 46, weight).apply {
        setMargins(3, 4, 3, 4)
      }
    }
  }

  private fun commitText(text: String) {
    val connection: InputConnection = currentInputConnection ?: return
    // TODO: replace mockApiReply with your server-powered AI request.
    connection.commitText(text, 1)
  }

  private fun rounded(color: Int, radius: Float): GradientDrawable {
    return GradientDrawable().apply {
      setColor(color)
      cornerRadius = radius
    }
  }
}
