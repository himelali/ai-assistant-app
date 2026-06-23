import UIKit

final class KeyboardViewController: UIInputViewController {
  private let classicBlue = UIColor(red: 24 / 255, green: 58 / 255, blue: 99 / 255, alpha: 1)
  private let accentYellow = UIColor(red: 242 / 255, green: 201 / 255, blue: 76 / 255, alpha: 1)
  private let lightGray = UIColor(red: 232 / 255, green: 237 / 255, blue: 243 / 255, alpha: 1)
  private let ink = UIColor(red: 20 / 255, green: 32 / 255, blue: 51 / 255, alpha: 1)
  private let danger = UIColor(red: 194 / 255, green: 65 / 255, blue: 75 / 255, alpha: 1)
  private var copiedContext = ""
  private var activeSelection = ""
  private var suggestedReply = "Select or copy WhatsApp, Messenger, or Telegram text."
  private var suggestionButton: UIButton?
  private var suggestionPanel: UIStackView?
  private var suggestionLabel: UILabel?

  override func viewDidLoad() {
    super.viewDidLoad()
    buildKeyboard()
  }

  private func buildKeyboard() {
    view.backgroundColor = lightGray

    let stack = UIStackView()
    stack.axis = .vertical
    stack.spacing = 7
    stack.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(stack)

    NSLayoutConstraint.activate([
      stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 8),
      stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -8),
      stack.topAnchor.constraint(equalTo: view.topAnchor, constant: 8),
      stack.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -8),
    ])

    stack.addArrangedSubview(makeSelectionToolbar())
    stack.addArrangedSubview(makeSuggestionPanel())
    stack.addArrangedSubview(makeSuggestionButton())
    stack.addArrangedSubview(makeToolbar())
    ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach { row in
      stack.addArrangedSubview(makeKeyRow(Array(row).map(String.init)))
    }
    stack.addArrangedSubview(makeBottomRow())
  }

  private func makeSelectionToolbar() -> UIStackView {
    let row = horizontalStack()
    let items: [(String, () -> Void)] = [
      ("Copy", { [weak self] in self?.copySelectedOrContext() }),
      ("Deselect", { [weak self] in self?.deselectText() }),
      ("Remove", { [weak self] in self?.removeSelectedText() }),
      ("Suggestion", { [weak self] in self?.generateSuggestion() }),
    ]
    items.forEach { title, action in
      row.addArrangedSubview(makeButton(title, background: title == "Remove" ? .white : classicBlue, foreground: title == "Remove" ? danger : .white, compact: true, action: action))
    }
    return row
  }

  private func makeSuggestionPanel() -> UIStackView {
    let panel = UIStackView()
    suggestionPanel = panel
    panel.axis = .vertical
    panel.spacing = 7
    panel.backgroundColor = .white
    panel.layer.cornerRadius = 12
    panel.isLayoutMarginsRelativeArrangement = true
    panel.layoutMargins = UIEdgeInsets(top: 8, left: 10, bottom: 8, right: 10)
    panel.isHidden = true

    let label = UILabel()
    suggestionLabel = label
    label.textColor = ink
    label.font = .systemFont(ofSize: 13, weight: .regular)
    label.numberOfLines = 2
    panel.addArrangedSubview(label)

    let actions = horizontalStack()
    actions.addArrangedSubview(makeButton("Copy", background: classicBlue, foreground: .white, compact: true) { [weak self] in
      self?.copySuggestion()
    })
    actions.addArrangedSubview(makeButton("Cancel", background: classicBlue, foreground: .white, compact: true) { [weak self] in
      self?.hideSuggestionPanel()
    })
    panel.addArrangedSubview(actions)
    return panel
  }

  private func makeSuggestionButton() -> UIButton {
    let button = UIButton(type: .system)
    suggestionButton = button
    updateSuggestionButtonTitle()
    button.setTitleColor(ink, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: 14, weight: .semibold)
    button.titleLabel?.numberOfLines = 2
    button.backgroundColor = accentYellow
    button.layer.cornerRadius = 12
    button.configuration = paddedConfiguration(foreground: ink, background: accentYellow)
    button.addAction(UIAction { [weak self] _ in
      self?.insert(self?.suggestedReply ?? "")
    }, for: .touchUpInside)
    return button
  }

  private func makeToolbar() -> UIStackView {
    let items: [(String, () -> Void)] = [
      ("Use Copy", { [weak self] in self?.loadCopiedContext() }),
      ("AI Reply", { [weak self] in self?.generateSuggestion() }),
      ("Fix", { [weak self] in self?.insert("I need this quickly.") }),
      ("Rewrite", { [weak self] in self?.insert("Could you please prioritize this?") }),
      ("Voice", { [weak self] in self?.insert("[Voice input placeholder]") }),
    ]
    let row = horizontalStack()
    items.forEach { title, action in
      row.addArrangedSubview(makeButton(title, background: classicBlue, foreground: .white, action: action))
    }
    return row
  }

  private func makeKeyRow(_ keys: [String]) -> UIStackView {
    let row = horizontalStack()
    keys.forEach { key in
      row.addArrangedSubview(makeButton(key, background: .white, foreground: ink) { [weak self] in
        self?.insert(key.lowercased())
      })
    }
    return row
  }

  private func makeBottomRow() -> UIStackView {
    let row = horizontalStack()
    row.addArrangedSubview(makeButton("123", background: .white, foreground: ink) { [weak self] in self?.insert("123") })
    row.addArrangedSubview(makeButton("🌐", background: .white, foreground: ink) { [weak self] in self?.advanceToNextInputMode() })
    row.addArrangedSubview(makeButton("space", background: .white, foreground: ink) { [weak self] in self?.insert(" ") })
    row.addArrangedSubview(makeButton("⌫", background: .white, foreground: ink) { [weak self] in self?.textDocumentProxy.deleteBackward() })
    row.addArrangedSubview(makeButton("↵", background: classicBlue, foreground: .white) { [weak self] in self?.insert("\n") })
    return row
  }

  private func horizontalStack() -> UIStackView {
    let row = UIStackView()
    row.axis = .horizontal
    row.distribution = .fillEqually
    row.spacing = 5
    return row
  }

  private func makeButton(
    _ title: String,
    background: UIColor,
    foreground: UIColor,
    compact: Bool = false,
    action: @escaping () -> Void
  ) -> UIButton {
    let button = UIButton(type: .system)
    button.setTitle(title, for: .normal)
    button.setTitleColor(foreground, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: compact || title.count > 1 ? 11 : 16, weight: .medium)
    button.titleLabel?.adjustsFontSizeToFitWidth = true
    button.titleLabel?.minimumScaleFactor = 0.78
    button.backgroundColor = background
    button.layer.cornerRadius = 9
    button.heightAnchor.constraint(equalToConstant: compact ? 34 : 40).isActive = true
    button.addAction(UIAction { _ in action() }, for: .touchUpInside)
    return button
  }

  private func paddedConfiguration(foreground: UIColor, background: UIColor) -> UIButton.Configuration {
    var configuration = UIButton.Configuration.filled()
    configuration.baseForegroundColor = foreground
    configuration.baseBackgroundColor = background
    configuration.contentInsets = NSDirectionalEdgeInsets(top: 9, leading: 12, bottom: 9, trailing: 12)
    return configuration
  }

  private func updateSuggestionButtonTitle() {
    suggestionButton?.setTitle("TypeAI: \(suggestedReply)", for: .normal)
  }

  private func loadCopiedContext() {
    copiedContext = UIPasteboard.general.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    activeSelection = copiedContext
    if copiedContext.isEmpty {
      suggestedReply = "Copy chat text first, then tap Use Copy."
    } else {
      suggestedReply = "Copied context ready. Tap Suggestion or AI Reply."
    }
    hideSuggestionPanel()
    updateSuggestionButtonTitle()
    if !copiedContext.isEmpty {
      generateSuggestion()
    }
  }

  private func copySelectedOrContext() {
    let text = selectedOrCopiedText()
    guard !text.isEmpty else {
      suggestedReply = "Select or copy chat text first."
      updateSuggestionButtonTitle()
      return
    }
    UIPasteboard.general.string = text
    activeSelection = text
    suggestedReply = "Selected text copied."
    updateSuggestionButtonTitle()
  }

  private func deselectText() {
    activeSelection = ""
    hideSuggestionPanel()
    suggestedReply = "Selection cleared."
    updateSuggestionButtonTitle()
  }

  private func removeSelectedText() {
    textDocumentProxy.deleteBackward()
    activeSelection = ""
    hideSuggestionPanel()
    suggestedReply = "Selected editable text removed if the host app allowed it."
    updateSuggestionButtonTitle()
  }

  private func generateSuggestion() {
    activeSelection = selectedOrCopiedText()
    guard !activeSelection.isEmpty else {
      suggestedReply = "Select editable text or copy chat text first."
      updateSuggestionButtonTitle()
      showSuggestionPanel(suggestedReply)
      return
    }

    suggestedReply = "Requesting mock AI suggestion..."
    updateSuggestionButtonTitle()
    showSuggestionPanel(suggestedReply)

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) { [weak self] in
      guard let self else { return }
      self.suggestedReply = self.mockSuggestion(from: self.activeSelection)
      self.updateSuggestionButtonTitle()
      self.showSuggestionPanel(self.suggestedReply)
    }
  }

  private func selectedOrCopiedText() -> String {
    let before = textDocumentProxy.documentContextBeforeInput?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    return activeSelection.isEmpty ? (copiedContext.isEmpty ? before : copiedContext) : activeSelection
  }

  private func copySuggestion() {
    UIPasteboard.general.string = suggestedReply
    hideSuggestionPanel()
    suggestedReply = "Suggestion copied."
    updateSuggestionButtonTitle()
  }

  private func showSuggestionPanel(_ text: String) {
    suggestionLabel?.text = text
    suggestionPanel?.isHidden = false
  }

  private func hideSuggestionPanel() {
    suggestionPanel?.isHidden = true
  }

  private func mockSuggestion(from context: String) -> String {
    let reviewed = reviewText(context)
    if reviewed != context.trimmingCharacters(in: .whitespacesAndNewlines), !reviewed.isEmpty {
      return reviewed
    }
    return mockReply(from: context)
  }

  private func mockReply(from context: String) -> String {
    let text = context.lowercased()
    if context.isEmpty {
      return "Please copy the incoming message first, then tap Use Copy."
    } else if text.contains("report") {
      return "Sure, I will send the report shortly. Thanks for the reminder."
    } else if text.contains("payment") || text.contains("milestone") {
      return "I will share the milestone update today. Thank you for checking in."
    } else if text.contains("call") || text.contains("meeting") {
      return "Yes, the meeting is still confirmed. I will be there on time."
    }
    return "Thanks for the message. I will check and get back to you shortly."
  }

  private func reviewText(_ input: String) -> String {
    var text = input.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return "" }
    text = text.replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)

    [
      "\\bteh\\b": "the",
      "\\bdont\\b": "don't",
      "\\bcant\\b": "can't",
      "\\bwont\\b": "won't",
      "\\bisnt\\b": "isn't",
      "\\bdoesnt\\b": "doesn't",
      "\\bim\\b": "I'm",
      "\\bive\\b": "I've",
      "\\byoure\\b": "you're",
      "\\bgrammer\\b": "grammar",
      "\\brecieve\\b": "receive",
      "\\bdefinately\\b": "definitely",
      "\\bi am agree\\b": "I agree",
      "\\bhe have\\b": "he has",
      "\\bshe have\\b": "she has",
      "\\bdid not went\\b": "did not go",
    ].forEach { pattern, replacement in
      text = text.replacingOccurrences(of: pattern, with: replacement, options: [.regularExpression, .caseInsensitive])
    }

    text = text
      .replacingOccurrences(of: "\\s+([,.!?;:])", with: "$1", options: .regularExpression)
      .replacingOccurrences(of: "([,.!?;:])(?=\\S)", with: "$1 ", options: .regularExpression)

    if let first = text.first, first.isLowercase {
      text = first.uppercased() + text.dropFirst()
    }
    if !text.hasSuffix(".") && !text.hasSuffix("!") && !text.hasSuffix("?") {
      text += "."
    }
    return text
  }

  private func insert(_ text: String) {
    textDocumentProxy.insertText(text)
  }
}
