// ========================================
// Professional Emoji Guessing Game - Classic Edition
// ========================================

const EmojiGame = {
    // Professional emoji puzzles database with creative combinations
    emojiPuzzles: [
        // الدراما الاجتماعية - Social Drama
        {
            emojis: '👨‍👩‍👧‍👦🎀',
            answer: 'عيال نوف',
            hint: 'الدراما الاجتماعية',
            year: '2022',
            category: 'social',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '🏜️❤️',
            answer: 'حوجن',
            hint: 'الدراما الاجتماعية',
            year: '2023',
            category: 'social',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '💐👩❤️',
            answer: 'أمي',
            hint: 'الدراما الاجتماعية',
            year: '2025',
            category: 'social',
            difficulty: 'easy',
            points: 10
        },
        
        // الدراما - Drama
        {
            emojis: '💰🎫😰',
            answer: 'مذكرة ابتزاز',
            hint: 'الدراما',
            year: '2020',
            category: 'drama',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '⏮️👥',
            answer: 'كنا امس',
            hint: 'الدراما',
            year: '2020',
            category: 'drama',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '⏳📅',
            answer: 'بعد حين',
            hint: 'الدراما',
            year: '2020',
            category: 'drama',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '💍❓😱',
            answer: 'ضحايا حلال',
            hint: 'الدراما',
            year: '2020',
            category: 'drama',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '🥊👧',
            answer: 'بنات الملاكمة',
            hint: 'الدراما',
            year: '2019-2020',
            category: 'drama',
            difficulty: 'medium',
            points: 20
        },
        {
            emojis: '🔗⛓️🔨',
            answer: 'دكة العبيد',
            hint: 'الدراما',
            year: '2023',
            category: 'drama',
            difficulty: 'easy',
            points: 10
        },
        
        // المسلسلات والخمسات - Series
        {
            emojis: '🎬🎙️📡',
            answer: 'ستوديو',
            hint: 'الخمسات',
            year: '2021',
            category: 'series',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '🎮👴',
            answer: 'لعبة كبار',
            hint: 'الخمسات',
            year: '2021',
            category: 'series',
            difficulty: 'easy',
            points: 10
        },
        {
            emojis: '☁️🍳👨‍🍳',
            answer: 'كلاود كيتشن',
            hint: 'الخمسات',
            year: '2023',
            category: 'series',
            difficulty: 'easy',
            points: 10
        }
    ],

    // Achievements system
    achievements: {
        firstWin: { name: 'البداية', emoji: '🎯', unlocked: false },
        streak3: { name: 'سلسلة ذهبية', emoji: '🔥', condition: 'streak_3', unlocked: false },
        streak5: { name: 'سلسلة 白金', emoji: '⚡', condition: 'streak_5', unlocked: false },
        perfect: { name: 'الكمال', emoji: '👑', condition: 'perfect', unlocked: false },
        highScore: { name: 'رقم قياسي', emoji: '🏆', condition: 'high_score', unlocked: false },
        speedDemon: { name: 'سرعة البرق', emoji: '⚡', condition: 'under_5s', unlocked: false }
    },

    // Game state
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    maxStreak: 0,
    timer: null,
    timeLeft: 15,
    powerUps: {
        fiftyFifty: true,
        hint: true,
        timeBonus: true
    },
    selectedDifficulty: 'all',
    selectedCategory: 'all',
    startTime: 0,
    unlockedAchievements: [],
    
    // Start the game
    startGame: function() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.powerUps = { fiftyFifty: true, hint: true, timeBonus: true };
        this.startTime = Date.now();
        this.unlockedAchievements = [];

        let filteredPuzzles = [...this.emojiPuzzles];
        if (this.selectedDifficulty !== 'all') {
            filteredPuzzles = filteredPuzzles.filter(p => p.difficulty === this.selectedDifficulty);
        }
        if (this.selectedCategory !== 'all') {
            filteredPuzzles = filteredPuzzles.filter(p => p.category === this.selectedCategory);
        }

        this.currentQuestions = this.shuffleArray(filteredPuzzles).slice(0, 5);

        document.getElementById('emojiGameStart').style.display = 'none';
        document.getElementById('emojiResultScreen').classList.remove('active');
        document.getElementById('emojiQuizScreen').classList.add('active');
        document.getElementById('emojiPowerUps').style.display = 'flex';
        document.getElementById('emojiAchievements').style.display = 'none';

        this.updatePowerUpsDisplay();
        this.showQuestion();
    },

    // Show current question
    showQuestion: function() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        document.getElementById('emojiQuestionProgress').textContent = 'السؤال ' + (this.currentQuestionIndex + 1) + ' من ' + this.currentQuestions.length;
        document.getElementById('emojiCurrentScore').textContent = this.score;
        document.getElementById('emojiProgressFill').style.width = ((this.currentQuestionIndex / this.currentQuestions.length) * 100) + '%';
        document.getElementById('emojiQuestionNumber').textContent = (this.currentQuestionIndex + 1);

        const emojiDisplay = document.getElementById('emojiDisplay');
        emojiDisplay.textContent = question.emojis;
        emojiDisplay.style.animation = 'none';
        setTimeout(() => { emojiDisplay.style.animation = 'emojiPop 0.5s ease-out'; }, 10);

        const categoryNames = { 'social': 'الدراما الاجتماعية', 'drama': 'الدراما', 'series': 'الخمسات' };
        const categoryColors = { 'social': 'linear-gradient(135deg, #e91e63, #9c27b0)', 'drama': 'linear-gradient(135deg, #f44336, #ff5722)', 'series': 'linear-gradient(135deg, #4caf50, #8bc34a)' };
        const emojiCategoryBadge = document.getElementById('emojiCategoryBadge');
        emojiCategoryBadge.textContent = categoryNames[question.category] || '';
        emojiCategoryBadge.style.background = categoryColors[question.category] || '#667eea';
        emojiCategoryBadge.style.display = 'inline-flex';

        const difficultyLabels = { 'easy': 'سهل', 'medium': 'متوسط', 'hard': 'صعب' };
        const difficultyColors = { 'easy': '#27ae60', 'medium': '#f39c12', 'hard': '#e74c3c' };
        const emojiDifficultyBadge = document.getElementById('emojiDifficultyBadge');
        emojiDifficultyBadge.textContent = difficultyLabels[question.difficulty] || 'متوسط';
        emojiDifficultyBadge.style.background = difficultyColors[question.difficulty] || '#f39c12';
        emojiDifficultyBadge.style.display = 'inline-flex';

        document.getElementById('emojiHintText').textContent = question.hint;

        const wrongOptions = this.emojiPuzzles.filter(p => p.answer !== question.answer).sort(() => Math.random() - 0.5).slice(0, 3).map(p => p.answer);
        const allOptions = this.shuffleArray([question.answer, ...wrongOptions]);

        const optionsGrid = document.getElementById('emojiOptionsGrid');
        optionsGrid.innerHTML = '';

        for (let i = 0; i < allOptions.length; i++) {
            const option = allOptions[i];
            const btn = document.createElement('button');
            btn.className = 'emoji-option-btn';
            btn.textContent = option;
            btn.dataset.answer = option;
            btn.style.animation = 'fadeInUp 0.5s ease-out ' + (i * 0.1) + 's both';
            btn.onclick = (function(selected, correctAnswer) {
                return function(event) { EmojiGame.checkAnswer(event, selected, correctAnswer); };
            })(option, question.answer);
            optionsGrid.appendChild(btn);
        }

        document.getElementById('emojiFeedback').classList.remove('show', 'correct', 'wrong');
        document.getElementById('emojiNextBtn').classList.remove('show');
        document.getElementById('emojiNextBtn').style.display = 'none';
        document.getElementById('emojiStreak').style.display = 'none';
        document.querySelectorAll('.powerup-btn').forEach(btn => btn.classList.remove('used'));

        this.startTimer();
    },

    // Start countdown timer
    startTimer: function() {
        this.timeLeft = 15;
        this.updateTimerDisplay();
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft === 5 && this.streak > 0) this.unlockAchievement('speedDemon');
            if (this.timeLeft <= 0) this.timeOut();
        }, 1000);
    },

    // Update timer display
    updateTimerDisplay: function() {
        const timerEl = document.getElementById('emojiTimerValue');
        timerEl.textContent = this.timeLeft;
        timerEl.classList.remove('warning', 'danger');
        if (this.timeLeft <= 5) timerEl.classList.add('danger');
        else if (this.timeLeft <= 10) timerEl.classList.add('warning');
    },

    // Handle time out
    timeOut: function() {
        clearInterval(this.timer);
        const question = this.currentQuestions[this.currentQuestionIndex];
        const allOptions = document.querySelectorAll('.emoji-option-btn');
        allOptions.forEach(opt => opt.classList.add('disabled'));
        allOptions.forEach(opt => {
            if (opt.dataset.answer === question.answer) {
                opt.classList.add('correct');
                opt.style.animation = 'pulse 0.5s infinite';
            }
        });
        this.streak = 0;
        this.wrongAnswers++;
        document.getElementById('emojiFeedback').textContent = '⏰ انتهى الوقت! الإجابة الصحيحة: ' + question.answer;
        document.getElementById('emojiFeedback').className = 'emoji-feedback show wrong';
        document.getElementById('emojiNextBtn').classList.add('show');
        document.getElementById('emojiNextBtn').style.display = 'inline-block';
    },

    // Check answer
    checkAnswer: function(event, selected, correct) {
        clearInterval(this.timer);
        const responseTime = 15 - this.timeLeft;
        const allOptions = document.querySelectorAll('.emoji-option-btn');
        allOptions.forEach(opt => opt.classList.add('disabled'));
        const question = this.currentQuestions[this.currentQuestionIndex];

        if (selected === correct) {
            event.target.classList.add('correct');
            event.target.style.animation = 'correctPulse 0.5s ease-out';
            
            const baseScore = question.points;
            const timeBonus = Math.max(0, (15 - responseTime) * 3);
            const questionScore = baseScore + timeBonus;
            this.score += questionScore;
            const comboBonus = this.streak >= 3 ? Math.floor(this.streak * 8) : 0;
            this.score += comboBonus;
            
            this.correctAnswers++;
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;
            if (this.streak >= 3) this.unlockAchievement('streak3');
            if (this.streak >= 5) this.unlockAchievement('streak5');
            if (this.streak >= 2) {
                const streakEl = document.getElementById('emojiStreak');
                document.getElementById('emojiStreakCount').textContent = this.streak;
                streakEl.style.display = 'flex';
                streakEl.style.animation = 'streakPop 0.5s ease-out';
            }
            document.getElementById('emojiCurrentScore').textContent = this.score;
            const feedbackMessages = ['ممتاز! ✨', 'برافو! ⭐', 'أحسنت! 🎉', 'عاشق للعنود 💫', 'قائد! 🏆', 'ساحر! 🪄'];
            document.getElementById('emojiFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('emojiFeedback').className = 'emoji-feedback show correct';
        } else {
            event.target.classList.add('wrong');
            event.target.style.animation = 'shake 0.5s ease-out';
            this.streak = 0;
            this.wrongAnswers++;
            allOptions.forEach(opt => {
                if (opt.dataset.answer === correct) opt.classList.add('correct');
            });
            const feedbackMessages = ['😅 ليس هذا، حاول مرة أخرى', '🤔 ليس كذلك، فكر مجدداً', '💪 لا تستسلم، حاول مرة أخرى'];
            document.getElementById('emojiFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('emojiFeedback').className = 'emoji-feedback show wrong';
        }
        document.getElementById('emojiNextBtn').classList.add('show');
        document.getElementById('emojiNextBtn').style.display = 'inline-block';
    },

    // Next question
    nextQuestion: function() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    },

    // Power-up functions
    useFiftyFifty: function() {
        if (!this.powerUps.fiftyFifty) return;
        const allOptions = document.querySelectorAll('.emoji-option-btn:not(.correct):not(.wrong)');
        const correctAnswer = this.currentQuestions[this.currentQuestionIndex].answer;
        const wrongOptions = Array.from(allOptions).filter(opt => opt.dataset.answer !== correctAnswer);
        if (wrongOptions.length >= 2) {
            this.shuffleArray(wrongOptions).slice(0, 2).forEach(opt => {
                opt.style.visibility = 'hidden';
                opt.style.opacity = '0';
                opt.style.transform = 'scale(0.8)';
            });
            this.powerUps.fiftyFifty = false;
            this.updatePowerUpsDisplay();
            this.showNotification('🎯 تم إخفاء إجابتين خاطئتين!');
        }
    },

    useHint: function() {
        if (!this.powerUps.hint) return;
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.showNotification('💡 ' + question.hint + ' (' + question.year + ') - ' + question.category);
        this.powerUps.hint = false;
        this.updatePowerUpsDisplay();
    },

    useTimeBonus: function() {
        if (!this.powerUps.timeBonus) return;
        this.timeLeft += 10;
        this.updateTimerDisplay();
        this.powerUps.timeBonus = false;
        this.updatePowerUpsDisplay();
        this.showNotification('⏰ +10 ثواني إضافية! 📅');
    },

    // Update power-ups display
    updatePowerUpsDisplay: function() {
        const fiftyBtn = document.getElementById('fiftyFiftyBtn');
        const hintBtn = document.getElementById('hintBtn');
        const timeBtn = document.getElementById('timeBonusBtn');
        fiftyBtn.classList.toggle('disabled', !this.powerUps.fiftyFifty);
        hintBtn.classList.toggle('disabled', !this.powerUps.hint);
        timeBtn.classList.toggle('disabled', !this.powerUps.timeBonus);
    },

    // Unlock achievement
    unlockAchievement: function(achievementKey) {
        if (!this.achievements[achievementKey].unlocked) {
            this.achievements[achievementKey].unlocked = true;
            this.unlockedAchievements.push(this.achievements[achievementKey]);
            const achievement = this.achievements[achievementKey];
            this.showNotification('🏅 إنجاز جديد: ' + achievement.emoji + ' ' + achievement.name);
        }
    },

    // Show notification
    showNotification: function(message) {
        const existingNotifications = document.querySelectorAll('.emoji-notification');
        existingNotifications.forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = 'emoji-notification';
        notification.textContent = message;
        notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%); color: #0d1117; padding: 15px 30px; border-radius: 50px; font-weight: 600; z-index: 10000; animation: emojiSlideDown 0.5s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.3); font-size: 1.1em;';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'emojiSlideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    },

    // Set difficulty
    setDifficulty: function(difficulty) {
        this.selectedDifficulty = difficulty;
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === difficulty));
    },

    // Set category
    setCategory: function(category) {
        this.selectedCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    },

    // Show results
    showResults: function() {
        clearInterval(this.timer);
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        const percentage = Math.round((this.correctAnswers / this.currentQuestions.length) * 100);
        document.getElementById('emojiQuizScreen').classList.remove('active');
        document.getElementById('emojiResultScreen').classList.add('active');
        document.getElementById('emojiProgressFill').style.width = '100%';
        document.getElementById('emojiFinalScore').textContent = this.score;
        document.getElementById('emojiCorrectAnswers').textContent = this.correctAnswers + '/' + this.currentQuestions.length;
        document.getElementById('emojiWrongAnswers').textContent = this.wrongAnswers;
        document.getElementById('emojiMaxStreak').textContent = this.maxStreak;
        document.getElementById('emojiAccuracy').textContent = percentage + '%';
        document.getElementById('emojiTotalTime').textContent = totalTime + 's';

        let grade = 'F';
        if (percentage === 100) grade = 'A+';
        else if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'A-';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';

        let emoji = '💪', title = 'حاول مرة أخرى!', message = 'لا بأس! حاول مرة أخرى لتحسين نتيجتك!', badge = '';

        if (percentage === 100) {
            emoji = '👑'; title = 'ملك Emoji!'; message = 'مبروك! إجابات صحيحة 100%! أنت خبير حقيقي!'; badge = '👑 المستوى: الأسطوري';
            this.unlockAchievement('perfect');
        } else if (this.score >= 150) {
            emoji = '🏆'; title = 'قائد Emoji!'; message = 'ممتاز! أنت خبير في رموز العنود سعود!'; badge = '🏆 المستوى: محترف';
        } else if (this.score >= 120) {
            emoji = '🌟'; title = 'نجم Emoji!'; message = 'رائع جداً! معرفة ممتازة بأعمالها!'; badge = '🌟 المستوى: متقدم';
        } else if (this.score >= 90) {
            emoji = '👍'; title = 'متقن Emoji!'; message = 'جيد جداً! أداء متميز!'; badge = '👍 المستوى: متوسط';
        } else if (this.score >= 60) {
            emoji = '😊'; title = 'واعد!'; message = 'لديك معرفة جيدة. استمر في التعلم!'; badge = '🌱 المستوى: مبتدئ';
        } else {
            emoji = '💪'; title = 'ابدأ من جديد!'; message = 'لا بأس! كل لاعب يبدأ من somewhere!'; badge = '📚 المستوى: مبتدئ';
        }

        document.getElementById('emojiResultEmoji').textContent = emoji;
        document.getElementById('emojiResultTitle').textContent = title;
        document.getElementById('emojiResultMessage').textContent = message;
        document.getElementById('emojiGrade').textContent = 'الدرجة: ' + grade;

        const badgeContainer = document.getElementById('emojiLevelBadge');
        if (badge) { badgeContainer.textContent = badge; badgeContainer.style.display = 'inline-flex'; }
        else { badgeContainer.style.display = 'none'; }

        this.saveHighScore();
        this.showAchievements();

        const savedHighScore = localStorage.getItem('emojiGameHighScore') || 0;
        if (this.score > savedHighScore) {
            document.getElementById('emojiNewHighScore').textContent = '🎉 رقم قياسي جديد!';
            document.getElementById('emojiNewHighScore').style.display = 'block';
            this.unlockAchievement('highScore');
        } else {
            document.getElementById('emojiNewHighScore').textContent = '🏅 أفضل رقم لك: ' + savedHighScore + ' نقطة';
            document.getElementById('emojiNewHighScore').style.display = 'block';
        }
    },

    // Show achievements
    showAchievements: function() {
        const achievementsContainer = document.getElementById('emojiAchievements');
        achievementsContainer.style.display = 'block';
        achievementsContainer.innerHTML = '';
        if (this.unlockedAchievements.length > 0) {
            const title = document.createElement('h4');
            title.textContent = '🏅 الإنجازات المحققة';
            title.style.cssText = 'color: #d4af37; margin-bottom: 15px; text-align: center;';
            achievementsContainer.appendChild(title);
            const grid = document.createElement('div');
            grid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;';
            this.unlockedAchievements.forEach(achievement => {
                const badge = document.createElement('div');
                badge.style.cssText = 'background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(244, 208, 63, 0.1)); border: 2px solid #d4af37; border-radius: 15px; padding: 10px 15px; text-align: center; animation: fadeInUp 0.5s ease-out;';
                badge.innerHTML = '<div style="font-size: 2em;">' + achievement.emoji + '</div><div style="color: #d4af37; font-weight: 600; font-size: 0.9em;">' + achievement.name + '</div>';
                grid.appendChild(badge);
            });
            achievementsContainer.appendChild(grid);
        }
    },

    // Save high score
    saveHighScore: function() {
        const savedHighScore = localStorage.getItem('emojiGameHighScore') || 0;
        if (this.score > savedHighScore) localStorage.setItem('emojiGameHighScore', this.score);
        let history = JSON.parse(localStorage.getItem('emojiGameHistory') || '[]');
        history.push({ date: new Date().toLocaleDateString('ar-SA'), score: this.score, correct: this.correctAnswers, total: this.currentQuestions.length, grade: document.getElementById('emojiGrade').textContent.replace('الدرجة: ', '') });
        history = history.slice(-10);
        localStorage.setItem('emojiGameHistory', JSON.stringify(history));
    },

    // Get high score
    getHighScore: function() { return localStorage.getItem('emojiGameHighScore') || 0; },
    getHistory: function() { return JSON.parse(localStorage.getItem('emojiGameHistory') || '[]'); },

    // Share score
    shareScore: function() {
        const score = this.score, correct = this.correctAnswers, total = this.currentQuestions.length, grade = document.getElementById('emojiGrade').textContent.replace('الدرجة: ', '');
        const text = '🎮 لعبت لعبة إيموجي العنود سعود!\n📊 نتيجتي: ' + score + ' نقطة\n✅ إجابات صحيحة: ' + correct + '/' + total + '\n🏅 الدرجة: ' + grade + '\n\n🎯 جرب الآن!';
        navigator.clipboard.writeText(text).then(() => { this.showNotification('📋 تم نسخ النتيجة! شاركها مع أصدقائك!'); }).catch(() => { this.showNotification('❌ لم يتم النسخ، حاول مرة أخرى'); });
    },

    // Shuffle array helper
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Global functions for emoji game
function startEmojiGame() { EmojiGame.startGame(); }
function nextEmojiQuestion() { EmojiGame.nextQuestion(); }
function useFiftyFifty() { EmojiGame.useFiftyFifty(); }
function useHint() { EmojiGame.useHint(); }
function useTimeBonus() { EmojiGame.useTimeBonus(); }
function setDifficulty(difficulty) { EmojiGame.setDifficulty(difficulty); }
function setCategory(category) { EmojiGame.setCategory(category); }
function shareEmojiScore() { EmojiGame.shareScore(); }

// Export
window.EmojiGame = EmojiGame;
window.startEmojiGame = startEmojiGame;
window.nextEmojiQuestion = nextEmojiQuestion;
window.useFiftyFifty = useFiftyFifty;
window.useHint = useHint;
window.useTimeBonus = useTimeBonus;
window.setDifficulty = setDifficulty;
window.setCategory = setCategory;
window.shareEmojiScore = shareEmojiScore;


// ========================================
// Works Quiz Game - مسابقات أعمال العنود سعود
// ========================================

const WorksQuiz = {
    // قاعدة بيانات شاملة للأسئلة
    questions: {
        // أسئلة تحديد الشخصيات
        characters: [
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "مذكرة ابتزاز"؟', correct: 'هديل', options: ['مريم', 'هديل', 'لميس', 'سارة'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "بنات الملاكمة"؟', correct: 'شمس', options: ['شمس', 'لميس', 'هديل', 'سارة'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "دكة العبيد"؟', correct: 'رحمه', options: ['رحمه', 'عبير', 'جمارى', 'مريم'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "كلاود كيتشن"؟', correct: 'عبير', options: ['عبير', 'رحمه', 'جمارى', 'مريم'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "حوجن"؟', correct: 'جمارى', options: ['جمارى', 'عبير', 'رحمه', 'مريم'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "أمي"؟', correct: 'مريم', options: ['مريم', 'هديل', 'شمس', 'خلود'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "ستوديو"؟', correct: 'أميرة', options: ['أميرة', 'مرزوقة', 'صمود', 'ملك'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "لعبة كبار"؟', correct: 'مرزوقة', options: ['مرزوقة', 'أميرة', 'صمود', 'مريم'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "عيال نوف"؟', correct: 'صمود', options: ['صمود', 'لميس', 'خلود', 'ملك'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "كنا امس"؟', correct: 'لميس', options: ['لميس', 'هديل', 'شمس', 'خلود'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "بعد حين"؟', correct: 'خلود', options: ['خلود', 'ملك', 'لميس', 'هديل'] },
            { q: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "ضحايا حلال"؟', correct: 'ملك', options: ['ملك', 'خلود', 'لميس', 'هديل'] }
        ],
        
        // أسئلة سنوات العرض
        years: [
            { q: 'في أي عام بدأت العنود سعود مسيرتها الفنية؟', correct: '2019', options: ['2018', '2019', '2020', '2021'] },
            { q: 'في أي سنة تم عرض مسلسل "أمي"؟', correct: '2025', options: ['2023', '2024', '2025', '2022'] },
            { q: 'في أي عام تم عرض مسلسل "دكة العبيد"؟', correct: '2023', options: ['2021', '2022', '2023', '2024'] },
            { q: 'في أي عام تم عرض مسلسل "عيال نوف"؟', correct: '2022', options: ['2020', '2021', '2022', '2023'] },
            { q: 'في أي عام تم عرض مسلسل "بنات الملاكمة"؟', correct: '2019-2020', options: ['2018-2019', '2019-2020', '2020-2021', '2021-2022'] },
            { q: 'في أي عام تم عرض مسلسل "ستوديو"؟', correct: '2021', options: ['2020', '2021', '2022', '2023'] },
            { q: 'في أي عام تم عرض مسلسل "مذكرة ابتزاز"؟', correct: '2020', options: ['2019', '2020', '2021', '2022'] },
            { q: 'في أي عام تم عرض مسلسل "حوجن"؟', correct: '2023', options: ['2021', '2022', '2023', '2024'] }
        ],
        
        // أسئلة تحديد الأعمال
        works: [
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "أميرة"؟', correct: 'ستوديو', options: ['ستوديو', 'لعبة كبار', 'عيال نوف', 'حوجن'] },
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "مرزوقة"؟', correct: 'لعبة كبار', options: ['ستوديو', 'لعبة كبار', 'عيال نوف', 'مذكرة ابتزاز'] },
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "جمارى"؟', correct: 'حوجن', options: ['دكة العبيد', 'حوجن', 'كلاود كيتشن', 'أمي'] },
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "شمس"؟', correct: 'بنات الملاكمة', options: ['بنات الملاكمة', 'مذكرة ابتزاز', 'كنا امس', 'بعد حين'] },
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "صمود"؟', correct: 'عيال نوف', options: ['عيال نوف', 'ستوديو', 'لعبة كبار', 'دكة العبيد'] },
            { q: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "رحمه"؟', correct: 'دكة العبيد', options: ['دكة العبيد', 'حوجن', 'كلاود كيتشن', 'أمي'] },
            { q: 'ما اسم الفيلم الذي يتناول قصة عن الأمومة؟', correct: 'أمي', options: ['أمي', 'أم', 'الأم', 'حنين'] },
            { q: 'ما اسم المسلسل الكوميدي الذي لعبت فيه العنود سعود؟', correct: 'لعبة كبار', options: ['لعبة كبار', 'ستوديو', 'عيال نوف', 'بنات الملاكمة'] }
        ],
        
        // أسئلة معلومات عامة
        general: [
            { q: 'كم عدد الأعمال التي شاركت فيها العنود سعود في عام 2020؟', correct: '4', options: ['2', '3', '4', '5'] },
            { q: 'كم عدد الأعمال التي شاركت فيها العنود سعود في عام 2023؟', correct: '3', options: ['2', '3', '4', '5'] },
            { q: 'كم عدد الأعمال التي شاركت فيها العنود سعود في عام 2021؟', correct: '2', options: ['1', '2', '3', '4'] },
            { q: 'كم إجمالي عدد الأعمال الدرامية للعنود سعود حتى 2025؟', correct: '13', options: ['10', '11', '12', '13'] },
            { q: 'ما أول مسلسل شاركت فيه العنود سعود؟', correct: 'بنات الملاكمة', options: ['بنات الملاكمة', 'مذكرة ابتزاز', 'كنا امس', 'بعد حين'] },
            { q: 'ما اسم المسلسل الذي يُعتبر من أبرز أعمالها في 2023؟', correct: 'دكة العبيد', options: ['دكة العبيد', 'حوجن', 'كلاود كيتشن', 'ستوديو'] },
            { q: 'ما نوع الدور الذي لعبته في فيلم "أمي"؟', correct: 'دور الأم', options: ['دور الأخت', 'دور الأم', 'دور صديقة', 'دور الجارة'] },
            { q: 'في أي شهر تُعرض المسلسلات الرمضانية عادةً؟', correct: 'رمضان', options: ['رمضان', 'شعبان', 'رجب', 'شوال'] }
        ]
    },

    // Achievements
    achievements: {
        firstWin: { name: 'البداية', emoji: '🎯', unlocked: false },
        streak3: { name: 'سلسلة ذهبية', emoji: '🔥', condition: 'streak_3', unlocked: false },
        streak5: { name: 'سلسلة 白金', emoji: '⚡', condition: 'streak_5', unlocked: false },
        perfect: { name: 'الكمال', emoji: '👑', condition: 'perfect', unlocked: false },
        highScore: { name: 'رقم قياسي', emoji: '🏆', condition: 'high_score', unlocked: false },
        allTypes: { name: 'عالم المعرفة', emoji: '🌍', condition: 'all_types', unlocked: false }
    },

    // إعدادات اللعبة
    settings: {
        questionsPerGame: 5,
        timePerQuestion: 15,
        pointsPerCorrect: 20,
        timeBonusPerSecond: 3,
        streakBonusMultiplier: 8
    },

    // حالة اللعبة
    state: {
        currentQuestions: [],
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        streak: 0,
        maxStreak: 0,
        timer: null,
        timeLeft: 15,
        startTime: 0,
        unlockedAchievements: [],
        selectedCategory: 'mixed'
    },

    // بدء اللعبة
    startGame: function(category = 'mixed') {
        this.state.currentQuestionIndex = 0;
        this.state.score = 0;
        this.state.correctAnswers = 0;
        this.state.wrongAnswers = 0;
        this.state.streak = 0;
        this.state.maxStreak = 0;
        this.state.startTime = Date.now();
        this.state.unlockedAchievements = [];
        this.state.selectedCategory = category;

        // اختيار الأسئلة حسب الفئة
        if (category === 'mixed') {
            let allQuestions = [];
            Object.keys(this.questions).forEach(type => {
                if (type !== 'general') {
                    this.questions[type].forEach(q => {
                        allQuestions.push({ ...q, type: type });
                    });
                }
            });
            this.state.currentQuestions = this.shuffleArray(allQuestions).slice(0, this.settings.questionsPerGame);
        } else {
            let categoryQuestions = this.questions[category] || [];
            this.state.currentQuestions = this.shuffleArray([...categoryQuestions]).slice(0, this.settings.questionsPerGame);
        }

        // إظهار شاشة اللعبة
        document.getElementById('worksQuizStart').style.display = 'none';
        document.getElementById('worksQuizResultScreen').classList.remove('active');
        document.getElementById('worksQuizScreen').classList.add('active');

        this.showQuestion();
    },

    // إظهار السؤال الحالي
    showQuestion: function() {
        const question = this.state.currentQuestions[this.state.currentQuestionIndex];
        
        document.getElementById('worksQuizProgress').textContent = 'السؤال ' + (this.state.currentQuestionIndex + 1) + ' من ' + this.state.currentQuestions.length;
        document.getElementById('worksQuizScore').textContent = this.state.score;
        document.getElementById('worksQuizProgressFill').style.width = ((this.state.currentQuestionIndex / this.state.currentQuestions.length) * 100) + '%';
        
        const categoryNames = {
            'characters': '🎭 تحديد الشخصيات',
            'years': '📅 تحديد السنوات',
            'works': '📺 تحديد الأعمال',
            'general': '📊 معلومات عامة'
        };
        
        document.getElementById('worksQuizCategory').textContent = categoryNames[question.type] || '📋 سؤال عام';
        document.getElementById('worksQuizQuestion').textContent = question.q;

        // ترتيب الخيارات عشوائياً
        const shuffledOptions = this.shuffleArray([...question.options]);

        // إنشاء أزرار الخيارات
        const optionsGrid = document.getElementById('worksQuizOptions');
        optionsGrid.innerHTML = '';

        shuffledOptions.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'works-quiz-option-btn';
            btn.textContent = option;
            btn.style.animation = 'fadeInUp 0.5s ease-out ' + (index * 0.1) + 's both';
            btn.onclick = (function(selected, correctAnswer) {
                return function(event) { WorksQuiz.checkAnswer(event, selected, correctAnswer); };
            })(option, question.correct);
            optionsGrid.appendChild(btn);
        });

        // إظهار مؤشر السلسلة
        if (this.state.streak >= 2) {
            document.getElementById('worksQuizStreak').style.display = 'flex';
            document.getElementById('worksQuizStreakCount').textContent = this.state.streak;
        } else {
            document.getElementById('worksQuizStreak').style.display = 'none';
        }

        // إخفاء عناصر التغذية الراجعة
        document.getElementById('worksQuizFeedback').classList.remove('show', 'correct', 'wrong');
        document.getElementById('worksQuizNextBtn').classList.remove('show');
        document.getElementById('worksQuizNextBtn').style.display = 'none';

        this.startTimer();
    },

    // بدء المؤقت
    startTimer: function() {
        this.state.timeLeft = this.settings.timePerQuestion;
        this.updateTimerDisplay();
        
        if (this.state.timer) clearInterval(this.state.timer);
        
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.state.timeLeft === 0) {
                this.handleTimeOut();
            }
        }, 1000);
    },

    // تحديث عرض المؤقت
    updateTimerDisplay: function() {
        const timerEl = document.getElementById('worksQuizTimer');
        timerEl.textContent = this.state.timeLeft;
        
        timerEl.classList.remove('warning', 'danger');
        if (this.state.timeLeft <= 5) {
            timerEl.classList.add('danger');
        } else if (this.state.timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
    },

    // معالجة انتهاء الوقت
    handleTimeOut: function() {
        clearInterval(this.state.timer);
        const question = this.state.currentQuestions[this.state.currentQuestionIndex];
        const allOptions = document.querySelectorAll('.works-quiz-option-btn');
        
        allOptions.forEach(opt => {
            opt.classList.add('disabled');
            if (opt.textContent === question.correct) {
                opt.classList.add('correct');
            }
        });
        
        this.state.streak = 0;
        this.state.wrongAnswers++;
        
        document.getElementById('worksQuizFeedback').textContent = '⏰ انتهى الوقت! الإجابة الصحيحة: ' + question.correct;
        document.getElementById('worksQuizFeedback').className = 'works-quiz-feedback show wrong';
        document.getElementById('worksQuizNextBtn').classList.add('show');
        document.getElementById('worksQuizNextBtn').style.display = 'inline-block';
    },

    // التحقق من الإجابة
    checkAnswer: function(event, selected, correct) {
        clearInterval(this.state.timer);
        
        const responseTime = this.settings.timePerQuestion - this.state.timeLeft;
        const allOptions = document.querySelectorAll('.works-quiz-option-btn');
        allOptions.forEach(opt => opt.classList.add('disabled'));
        
        if (selected === correct) {
            event.target.classList.add('correct');
            
            // حساب النقاط
            const baseScore = this.settings.pointsPerCorrect;
            const timeBonus = Math.max(0, (this.settings.timePerQuestion - responseTime) * this.settings.timeBonusPerSecond);
            let questionScore = baseScore + timeBonus;
            
            // مكافأة السلسلة
            if (this.state.streak >= 3) {
                const comboBonus = this.state.streak * this.settings.streakBonusMultiplier;
                questionScore += comboBonus;
            }
            
            this.state.score += questionScore;
            this.state.correctAnswers++;
            this.state.streak++;
            
            if (this.state.streak > this.state.maxStreak) {
                this.state.maxStreak = this.state.streak;
            }
            
            // فتح الإنجازات
            if (this.state.streak >= 3) this.unlockAchievement('streak3');
            if (this.state.streak >= 5) this.unlockAchievement('streak5');
            
            document.getElementById('worksQuizScore').textContent = this.state.score;
            
            const feedbackMessages = ['ممتاز! ✨', 'برافو! ⭐', 'أحسنت! 🎉', 'عاشق للعنود 💫', 'قائد! 🏆'];
            document.getElementById('worksQuizFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('worksQuizFeedback').className = 'works-quiz-feedback show correct';
        } else {
            event.target.classList.add('wrong');
            this.state.streak = 0;
            this.state.wrongAnswers++;
            
            allOptions.forEach(opt => {
                if (opt.textContent === correct) {
                    opt.classList.add('correct');
                }
            });
            
            const feedbackMessages = ['😅 ليس هذا، حاول مرة أخرى', '🤔 ليس كذلك، فكر مجدداً', '💪 لا تستسلم'];
            document.getElementById('worksQuizFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('worksQuizFeedback').className = 'works-quiz-feedback show wrong';
        }
        
        // تحديث مؤشر السلسلة
        if (this.state.streak >= 2) {
            document.getElementById('worksQuizStreak').style.display = 'flex';
            document.getElementById('worksQuizStreakCount').textContent = this.state.streak;
        } else {
            document.getElementById('worksQuizStreak').style.display = 'none';
        }
        
        document.getElementById('worksQuizNextBtn').classList.add('show');
        document.getElementById('worksQuizNextBtn').style.display = 'inline-block';
    },

    // السؤال التالي
    nextQuestion: function() {
        this.state.currentQuestionIndex++;
        
        if (this.state.currentQuestionIndex < this.state.currentQuestions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    },

    // إظهار النتائج
    showResults: function() {
        clearInterval(this.state.timer);
        
        const totalTime = Math.round((Date.now() - this.state.startTime) / 1000);
        const percentage = Math.round((this.state.correctAnswers / this.state.currentQuestions.length) * 100);
        
        document.getElementById('worksQuizScreen').classList.remove('active');
        document.getElementById('worksQuizResultScreen').classList.add('active');
        document.getElementById('worksQuizProgressFill').style.width = '100%';
        
        document.getElementById('worksQuizFinalScore').textContent = this.state.score;
        document.getElementById('worksQuizCorrectCount').textContent = this.state.correctAnswers + '/' + this.state.currentQuestions.length;
        document.getElementById('worksQuizWrongCount').textContent = this.state.wrongAnswers;
        document.getElementById('worksQuizMaxStreak').textContent = this.state.maxStreak;
        document.getElementById('worksQuizAccuracy').textContent = percentage + '%';
        document.getElementById('worksQuizTotalTime').textContent = totalTime + 's';
        
        // تحديد الدرجة
        let grade = 'F';
        if (percentage === 100) grade = 'A+';
        else if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'A-';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';
        
        document.getElementById('worksQuizGrade').textContent = 'الدرجة: ' + grade;
        
        // تحديد العنوان والرسالة حسب النتيجة
        let emoji = '💪', title = 'حاول مرة أخرى!', message = 'لا بأس! حاول مرة أخرى لتحسين نتيجتك!';
        
        if (percentage === 100) {
            emoji = '👑'; title = 'ملك المسابقات!'; message = 'مبروك! إجابات صحيحة 100%! أنت خبير حقيقي بأعمال العنود سعود!';
            this.unlockAchievement('perfect');
        } else if (this.state.score >= 150) {
            emoji = '🏆'; title = 'قائد!'; message = 'ممتاز! أنت خبير في أعمال العنود سعود!';
        } else if (this.state.score >= 120) {
            emoji = '🌟'; title = 'نجم!'; message = 'رائع جداً! معرفة ممتازة بأعمالها!';
        } else if (this.state.score >= 90) {
            emoji = '👍'; title = 'متقن!'; message = 'جيد جداً! أداء متميز!';
        } else if (this.state.score >= 60) {
            emoji = '😊'; title = 'واعد!'; message = 'لديك معرفة جيدة. استمر في التعلم!';
        }
        
        document.getElementById('worksQuizResultEmoji').textContent = emoji;
        document.getElementById('worksQuizResultTitle').textContent = title;
        document.getElementById('worksQuizResultMessage').textContent = message;
        
        // حفظ الرقم القياسي
        this.saveHighScore();
        
        // إظهار رسالة الرقم القياسي
        const savedHighScore = localStorage.getItem('worksQuizHighScore') || 0;
        if (this.state.score > savedHighScore) {
            const highScoreEl = document.getElementById('worksQuizNewHighScore');
            highScoreEl.textContent = '🎉 رقم قياسي جديد!';
            highScoreEl.style.display = 'block';
            this.unlockAchievement('highScore');
        } else {
            const highScoreEl = document.getElementById('worksQuizNewHighScore');
            highScoreEl.textContent = '🏅 أفضل رقم لك: ' + savedHighScore + ' نقطة';
            highScoreEl.style.display = 'block';
        }
        
        // إظهار الإنجازات
        this.showAchievements();
    },

    // فتح إنجاز
    unlockAchievement: function(achievementKey) {
        if (!this.achievements[achievementKey].unlocked) {
            this.achievements[achievementKey].unlocked = true;
            this.state.unlockedAchievements.push(this.achievements[achievementKey]);
            const achievement = this.achievements[achievementKey];
            this.showNotification('🏅 إنجاز جديد: ' + achievement.emoji + ' ' + achievement.name);
        }
    },

    // إظهار الإشعارات
    showNotification: function(message) {
        const existingNotifications = document.querySelectorAll('.works-quiz-notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'works-quiz-notification';
        notification.textContent = message;
        notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%); color: #0d1117; padding: 15px 30px; border-radius: 50px; font-weight: 600; z-index: 10000; animation: emojiSlideDown 0.5s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.3); font-size: 1.1em;';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'emojiSlideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    },

    // إظهار الإنجازات
    showAchievements: function() {
        const achievementsContainer = document.getElementById('worksQuizAchievements');
        achievementsContainer.style.display = 'block';
        achievementsContainer.innerHTML = '';
        
        if (this.state.unlockedAchievements.length > 0) {
            const title = document.createElement('h4');
            title.textContent = '🏅 الإنجازات المحققة';
            title.style.cssText = 'color: #d4af37; margin-bottom: 15px; text-align: center;';
            achievementsContainer.appendChild(title);
            
            const grid = document.createElement('div');
            grid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;';
            
            this.state.unlockedAchievements.forEach(achievement => {
                const badge = document.createElement('div');
                badge.style.cssText = 'background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(244, 208, 63, 0.1)); border: 2px solid #d4af37; border-radius: 15px; padding: 10px 15px; text-align: center; animation: fadeInUp 0.5s ease-out;';
                badge.innerHTML = '<div style="font-size: 2em;">' + achievement.emoji + '</div><div style="color: #d4af37; font-weight: 600; font-size: 0.9em;">' + achievement.name + '</div>';
                grid.appendChild(badge);
            });
            
            achievementsContainer.appendChild(grid);
        }
    },

    // حفظ الرقم القياسي
    saveHighScore: function() {
        const savedHighScore = localStorage.getItem('worksQuizHighScore') || 0;
        if (this.state.score > savedHighScore) {
            localStorage.setItem('worksQuizHighScore', this.state.score);
        }
        
        // حفظ التاريخ
        let history = JSON.parse(localStorage.getItem('worksQuizHistory') || '[]');
        history.push({
            date: new Date().toLocaleDateString('ar-SA'),
            score: this.state.score,
            correct: this.state.correctAnswers,
            total: this.state.currentQuestions.length,
            grade: document.getElementById('worksQuizGrade').textContent.replace('الدرجة: ', '')
        });
        history = history.slice(-10);
        localStorage.setItem('worksQuizHistory', JSON.stringify(history));
    },

    // مشاركة النتيجة
    shareScore: function() {
        const text = '🎮 لعبت مسابقات أعمال العنود سعود!\n📊 نتيجتي: ' + this.state.score + ' نقطة\n✅ إجابات صحيحة: ' + this.state.correctAnswers + '/' + this.state.currentQuestions.length + '\n🏅 الدرجة: ' + document.getElementById('worksQuizGrade').textContent.replace('الدرجة: ', '') + '\n\n🎯 جرب الآن!';
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('📋 تم نسخ النتيجة! شاركها مع أصدقائك!');
        }).catch(() => {
            this.showNotification('❌ لم يتم النسخ، حاول مرة أخرى');
        });
    },

    // دالة مساعدة لخلط المصفوفة
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // الحصول على الرقم القياسي
    getHighScore: function() {
        return localStorage.getItem('worksQuizHighScore') || 0;
    },

    // الحصول على التاريخ
    getHistory: function() {
        return JSON.parse(localStorage.getItem('worksQuizHistory') || '[]');
    }
};

// دوال عامة للعبة
function startWorksQuiz(category) {
    WorksQuiz.startGame(category);
}

function nextWorksQuizQuestion() {
    WorksQuiz.nextQuestion();
}

function shareWorksQuizScore() {
    WorksQuiz.shareScore();
}

// تصدير الدوال
window.WorksQuiz = WorksQuiz;
window.startWorksQuiz = startWorksQuiz;
window.nextWorksQuizQuestion = nextWorksQuizQuestion;
window.shareWorksQuizScore = shareWorksQuizScore;

