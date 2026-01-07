# TODO List - Remove Emoji Game, Restore Old Quiz Game

## Phase 1: Remove Emoji Game HTML
- [ ] Remove `#emojiGame` container from Games section
- [ ] Remove `#emojiGameStart` div
- [ ] Remove `#emojiQuizScreen` div
- [ ] Remove `#emojiResultScreen` div

## Phase 2: Remove Emoji Game CSS
- [ ] Remove `.emoji-display` styles
- [ ] Remove `.emoji-feedback` styles
- [ ] Remove `.emoji-timer-value` styles
- [ ] Remove `.emoji-category-badge` styles
- [ ] Remove `.emoji-difficulty-badge` styles
- [ ] Remove `.emoji-level-badge` styles
- [ ] Remove `.emoji-streak` styles
- [ ] Remove `.emoji-option-btn` styles
- [ ] Remove `.emoji-high-score` styles
- [ ] Remove `.emoji-game-container` styles
- [ ] Remove `.emoji-game-screen` styles
- [ ] Remove `.emoji-power-ups` styles
- [ ] Remove professional game animations (@keyframes emojiPop, correctPulse, shake, streakPop, gradePop)
- [ ] Remove `.powerup-btn` styles (emoji-specific)
- [ ] Remove `.emoji-filters` styles
- [ ] Remove `.emoji-notification` styles

## Phase 3: Remove Emoji Game Script
- [ ] Remove `<script src="fan-messages.js"></script>` reference

## Phase 4: Restore Old Quiz Game HTML
- [ ] Add `#gameStart` div (start screen with quiz icon and rules)
- [ ] Add `#quizScreen` div (question display with progress bar)
- [ ] Add `#resultScreen` div (final score and stats)

## Phase 5: Verify Old Quiz Game Works
- [ ] Test `startGame()` function
- [ ] Test `showQuestion()` function
- [ ] Test `checkAnswer()` function
- [ ] Test `nextQuestion()` function
- [ ] Test `showResults()` function

