package com.appsbean.typeai

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

class ProcessTextActivity : Activity() {
  private val classicBlue = Color.rgb(24, 58, 99)
  private val accentYellow = Color.rgb(242, 201, 76)
  private val lightGray = Color.rgb(232, 237, 243)
  private val surface = Color.WHITE
  private val ink = Color.rgb(20, 32, 51)
  private val errorColor = Color.rgb(194, 65, 75)

  private lateinit var sourceText: String
  private var readOnly = true
  private var suggestion = ""
  private lateinit var sourceTextView: TextView
  private lateinit var suggestionPanel: LinearLayout
  private lateinit var suggestionTextView: TextView

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    sourceText = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)?.toString()?.trim().orEmpty()
    readOnly = intent.getBooleanExtra(Intent.EXTRA_PROCESS_TEXT_READONLY, true)
    suggestion = sourceText

    setContentView(buildContent())
  }

  private fun buildContent(): View {
    return ScrollView(this).apply {
      setBackgroundColor(lightGray)
      addView(LinearLayout(context).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(28, 28, 28, 28)

        addView(TextView(context).apply {
          text = "TypeAI Add-on"
          setTextColor(ink)
          textSize = 22f
          typeface = Typeface.DEFAULT_BOLD
        })

        addView(TextView(context).apply {
          text = "This appears as an extra text action beside the host app's own menu when Android exposes text processing."
          setTextColor(ink)
          textSize = 13f
          setPadding(0, 10, 0, 18)
        })

        addView(TextView(context).apply {
          text = if (sourceText.isBlank()) "No text was passed from the host app." else sourceText
          setTextColor(ink)
          textSize = 14f
          background = rounded(surface, 18f)
          setPadding(24, 24, 24, 24)
          sourceTextView = this
        })

        addView(buildToolbar())
        addView(buildSuggestionPanel())
      })
    }
  }

  private fun buildToolbar(): View {
    return LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(0, 18, 0, 0)
      addView(buttonRow(
        "Copy" to { copyText(sourceText) },
        "Deselect" to { finish() }
      ))
      addView(buttonRow(
        "Remove" to { removeText() },
        "Suggestion" to { showSuggestion() }
      ).apply {
        setPadding(0, 10, 0, 0)
      })
    }
  }

  private fun buildSuggestionPanel(): LinearLayout {
    return LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      visibility = View.GONE
      background = rounded(surface, 18f)
      setPadding(22, 22, 22, 22)
      val params = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      )
      params.topMargin = 18
      layoutParams = params

      addView(TextView(context).apply {
        text = "Suggestion"
        setTextColor(ink)
        textSize = 13f
        typeface = Typeface.DEFAULT_BOLD
      })

      addView(TextView(context).apply {
        suggestionTextView = this
        setTextColor(ink)
        textSize = 14f
        setPadding(0, 10, 0, 16)
      })

      addView(buttonRow(
        "Copy" to { copyText(suggestion) },
        "Cancel" to { visibility = View.GONE }
      ))

      suggestionPanel = this
    }
  }

  private fun buttonRow(left: Pair<String, () -> Unit>, right: Pair<String, () -> Unit>): LinearLayout {
    return LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      addView(actionButton(left.first, left.first == "Remove", left.second))
      addView(actionButton(right.first, false, right.second))
    }
  }

  private fun actionButton(label: String, destructive: Boolean, onClick: () -> Unit): View {
    return Button(this).apply {
      text = label
      textSize = 12f
      setAllCaps(false)
      setTextColor(if (destructive) errorColor else surface)
      background = rounded(if (destructive) surface else classicBlue, 18f)
      setOnClickListener { onClick() }
      layoutParams = LinearLayout.LayoutParams(0, 104, 1f).apply {
        height = 98
        setMargins(0, 0, 12, 0)
      }
    }
  }

  private fun removeText() {
    if (readOnly) {
      showSuggestionPanel("The host app marked this text as read-only, so TypeAI cannot remove it here.")
      return
    }
    returnProcessedText("")
  }

  private fun showSuggestion() {
    val reviewed = reviewText(sourceText)
    suggestion = if (reviewed != sourceText && reviewed.isNotBlank()) reviewed else mockReply(sourceText)
    showSuggestionPanel(suggestion)
  }

  private fun showSuggestionPanel(text: String) {
    suggestionTextView.text = text
    suggestionPanel.visibility = View.VISIBLE
  }

  private fun copyText(text: String) {
    val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    clipboard.setPrimaryClip(ClipData.newPlainText("TypeAI", text))
  }

  private fun returnProcessedText(text: String) {
    setResult(RESULT_OK, Intent().putExtra(Intent.EXTRA_PROCESS_TEXT, text))
    finish()
  }

  private fun mockReply(context: String): String {
    val text = context.lowercase()
    return when {
      context.isBlank() -> "Select text in the host app first."
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

  private fun rounded(color: Int, radius: Float): GradientDrawable {
    return GradientDrawable().apply {
      setColor(color)
      cornerRadius = radius
    }
  }
}
