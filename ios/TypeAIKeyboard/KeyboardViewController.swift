import UIKit

final class KeyboardViewController: UIInputViewController {
  private let classicBlue = UIColor(red: 24 / 255, green: 58 / 255, blue: 99 / 255, alpha: 1)
  private let accentYellow = UIColor(red: 242 / 255, green: 201 / 255, blue: 76 / 255, alpha: 1)
  private let lightGray = UIColor(red: 232 / 255, green: 237 / 255, blue: 243 / 255, alpha: 1)
  private let ink = UIColor(red: 20 / 255, green: 32 / 255, blue: 51 / 255, alpha: 1)
  private var copiedContext = ""
  private var suggestedReply = "Can you please share the latest meeting update?"
  private var suggestionButton: UIButton?

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

    let suggestion = makeSuggestionButton()
    stack.addArrangedSubview(suggestion)
    stack.addArrangedSubview(makeToolbar())
    ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach { row in
      stack.addArrangedSubview(makeKeyRow(Array(row).map(String.init)))
    }
    stack.addArrangedSubview(makeBottomRow())
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
      ("Mock API", { [weak self] in self?.generateReply() }),
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
    action: @escaping () -> Void
  ) -> UIButton {
    let button = UIButton(type: .system)
    button.setTitle(title, for: .normal)
    button.setTitleColor(foreground, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: title.count > 1 ? 12 : 16, weight: .medium)
    button.backgroundColor = background
    button.layer.cornerRadius = 9
    button.heightAnchor.constraint(equalToConstant: 40).isActive = true
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
    suggestionButton?.setTitle("AI suggestion: \(suggestedReply)", for: .normal)
  }

  private func loadCopiedContext() {
    copiedContext = UIPasteboard.general.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    if copiedContext.isEmpty {
      suggestedReply = "Copy a message first, then tap Use Copy."
    } else {
      suggestedReply = "Copied context ready. Tap Mock API to draft a response."
    }
    updateSuggestionButtonTitle()
  }

  private func generateReply() {
    // TODO: replace this local mock logic with your server API later.
    let context = copiedContext.lowercased()
    if context.contains("report") {
      suggestedReply = "Sure, I will send the report shortly. Thanks for the reminder."
    } else if context.contains("payment") || context.contains("milestone") {
      suggestedReply = "I will share the milestone update today. Thank you for checking in."
    } else if context.contains("call") || context.contains("meeting") {
      suggestedReply = "Yes, the meeting is still confirmed. I will be there on time."
    } else if copiedContext.isEmpty {
      suggestedReply = "Please copy the incoming message first, then tap Use Copy."
    } else {
      suggestedReply = "Thanks for the message. I will check and get back to you shortly."
    }
    updateSuggestionButtonTitle()
  }

  private func insert(_ text: String) {
    textDocumentProxy.insertText(text)
  }
}
