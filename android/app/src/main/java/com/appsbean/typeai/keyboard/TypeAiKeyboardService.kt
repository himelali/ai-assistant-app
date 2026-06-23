package com.appsbean.typeai.keyboard

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.inputmethodservice.InputMethodService
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.inputmethod.ExtractedTextRequest
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
  private val errorColor = Color.rgb(194, 65, 75)
  private val mainHandler = Handler(Looper.getMainLooper())
  private var copiedContext = ""
  private var activeSelection = ""
  private var suggestedReply = "Select or copy WhatsApp, Messenger, or Telegram text."
  private var suggestionStrip: TextView? = null
  private var suggestionPanel: LinearLayout? = null
  private var suggestionPanelText: TextView? = null

  override fun onCreateInputView(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(10, 10, 10, 10)
      setBackgroundColor(lightGray)
      addView(buildSelectionTooltip())
      addView(buildSuggestionPanel())
      addView(buildSuggestionStrip())
      addView(buildToolbar())
      addKeyboardRow("QWERTYUIOP")
      addKeyboardRow("ASDFGHJKL")
      addKeyboardRow("ZXCVBNM")
      addView(buildBottomRow())
    }
  }

  private fun buildSelectionTooltip(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      setPadding(0, 0, 0, 8)
      listOf(
        "Copy" to { copySelectedOrContext() },
        "Deselect" to { deselectText() },
        "Remove" to { removeSelectedText() },
        "Suggestion" to { suggestFromSelectedOrContext() }
      ).forEach { (label, action) ->
        addView(toolbarButton(label, compact = true) { action() })
      }
    }
  }

  private fun buildSuggestionPanel(): View {
    return LinearLayout(this).apply {
      suggestionPanel = this
      orientation = LinearLayout.VERTICAL
      visibility = View.GONE
      setPadding(10, 8, 10, 8)
      background = rounded(surface, 14f)
      suggestionPanelText = TextView(context).apply {
        setTextColor(ink)
        textSize = 13f
        setPadding(4, 0, 4, 8)
      }
      addView(suggestionPanelText)
      addView(LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.END
        addView(toolbarButton("Copy", compact = true) { copySuggestion() })
        addView(toolbarButton("Cancel", compact = true) { hideSuggestionPanel() })
      })
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
        "AI Reply" to { suggestFromSelectedOrContext() },
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
    copiedContext = if (clipboard.hasPrimaryClip() && (clipboard.primaryClip?.itemCount ?: 0) > 0) {
      clipboard.primaryClip?.getItemAt(0)?.coerceToText(this)?.toString()?.trim().orEmpty()
    } else {
      ""
    }

    activeSelection = copiedContext
    suggestedReply = if (copiedContext.isBlank()) {
      "Copy chat text first, then tap Use Copy."
    } else {
      "Copied context ready. Tap Suggestion or AI Reply."
    }
    hideSuggestionPanel()
    updateSuggestionStrip()
    if (copiedContext.isNotBlank()) {
      mainHandler.post { suggestFromSelectedOrContext() }
    }
  }

  private fun suggestFromSelectedOrContext() {
    activeSelection = readSelectedText().ifBlank { copiedContext }.ifBlank { activeSelection }
    if (activeSelection.isBlank()) {
      suggestedReply = "Select editable text or copy chat text first."
      updateSuggestionStrip()
      showSuggestionPanel(suggestedReply)
      return
    }

    suggestedReply = "Requesting mock AI suggestion..."
    updateSuggestionStrip()
    showSuggestionPanel(suggestedReply)

    mainHandler.postDelayed({
      suggestedReply = mockSuggestion(activeSelection)
      updateSuggestionStrip()
      showSuggestionPanel(suggestedReply)
    }, 700)
  }

  private fun copySelectedOrContext() {
    val text = readSelectedText().ifBlank { copiedContext }.ifBlank { activeSelection }
    if (text.isBlank()) {
      suggestedReply = "Select or copy chat text first."
      updateSuggestionStrip()
      return
    }

    val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    clipboard.setPrimaryClip(ClipData.newPlainText("TypeAI selection", text))
    activeSelection = text
    suggestedReply = "Selected text copied."
    updateSuggestionStrip()
  }

  private fun copySuggestion() {
    val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    clipboard.setPrimaryClip(ClipData.newPlainText("TypeAI suggestion", suggestedReply))
    hideSuggestionPanel()
    suggestedReply = "Suggestion copied."
    updateSuggestionStrip()
  }

  private fun deselectText() {
    val connection = currentInputConnection ?: return
    val extracted = connection.getExtractedText(ExtractedTextRequest(), 0)
    if (extracted != null) {
      val end = maxOf(extracted.selectionStart, extracted.selectionEnd)
      if (end >= 0) {
        connection.setSelection(end, end)
      }
    }
    activeSelection = ""
    hideSuggestionPanel()
    suggestedReply = "Selection cleared."
    updateSuggestionStrip()
  }

  private fun removeSelectedText() {
    val connection = currentInputConnection ?: return
    val selected = readSelectedText()
    if (selected.isBlank()) {
      suggestedReply = "Select editable text first, then tap Remove."
      updateSuggestionStrip()
      return
    }

    connection.commitText("", 1)
    activeSelection = ""
    hideSuggestionPanel()
    suggestedReply = "Selected text removed."
    updateSuggestionStrip()
  }

  private fun readSelectedText(): String {
    return currentInputConnection
      ?.getSelectedText(0)
      ?.toString()
      ?.trim()
      .orEmpty()
  }

  private fun showSuggestionPanel(text: String) {
    suggestionPanelText?.text = text
    suggestionPanel?.visibility = View.VISIBLE
  }

  private fun hideSuggestionPanel() {
    suggestionPanel?.visibility = View.GONE
  }

  private fun mockSuggestion(context: String): String {
    val reviewed = reviewText(context)
    if (reviewed != context.trim() && reviewed.isNotBlank()) {
      return reviewed
    }
    return mockApiReply(context)
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

  private fun reviewText(input: String): String {
    if (input.isBlank()) return ""
    var text = input.trim().replace(Regex("\\s+"), " ")
    val replacements = mapOf(
      "teh" to "the",
      "dont" to "don't",
      "cant" to "can't",
      "wont" to "won't",
      "isnt" to "isn't",
      "doesnt" to "doesn't",
      "im" to "I'm",
      "ive" to "I've",
      "youre" to "you're",
      "grammer" to "grammar",
      "recieve" to "receive",
      "definately" to "definitely"
    )

    replacements.forEach { (wrong, right) ->
      text = text.replace(Regex("\\b$wrong\\b", RegexOption.IGNORE_CASE), right)
    }

    text = text
      .replace(Regex("\\bi am agree\\b", RegexOption.IGNORE_CASE), "I agree")
      .replace(Regex("\\bhe have\\b", RegexOption.IGNORE_CASE), "he has")
      .replace(Regex("\\bshe have\\b", RegexOption.IGNORE_CASE), "she has")
      .replace(Regex("\\bdid not went\\b", RegexOption.IGNORE_CASE), "did not go")
      .replace(Regex("\\s+([,.!?;:])"), "$1")
      .replace(Regex("([,.!?;:])(?=\\S)"), "$1 ")

    text = text.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    if (!text.endsWith(".") && !text.endsWith("!") && !text.endsWith("?")) {
      text += "."
    }
    return text
  }

  private fun suggestionLabel(): String = "TypeAI: $suggestedReply"

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

  private fun toolbarButton(label: String, compact: Boolean = false, onClick: () -> Unit): View {
    return Button(this).apply {
      text = label
      textSize = if (compact) 11f else 12f
      setTextColor(if (label == "Remove") errorColor else surface)
      background = rounded(if (label == "Remove") surface else classicBlue, 18f)
      setAllCaps(false)
      setOnClickListener { onClick() }
      layoutParams = LinearLayout.LayoutParams(0, if (compact) 36 else 42, 1f).apply {
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
    // TODO: replace mockSuggestion with your server-powered AI request.
    connection.commitText(text, 1)
  }

  private fun rounded(color: Int, radius: Float): GradientDrawable {
    return GradientDrawable().apply {
      setColor(color)
      cornerRadius = radius
    }
  }
}
