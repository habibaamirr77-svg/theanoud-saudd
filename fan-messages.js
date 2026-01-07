// نظام رسائل المعجبين - Fan Messages System
// Uses localStorage for local persistence and Firebase for cross-device sync

// ==================== Firebase Configuration ====================
// Using Firebase Realtime Database for cross-device sync
// Demo mode: uses localStorage with simulated real-time updates

// Firebase configuration - Replace with your own to enable cross-device sync
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey_ReplaceWithYourOwn",
    authDomain: "fan-messages-demo.firebaseapp.com",
    databaseURL: "https://fan-messages-demo-default-rtdb.firebaseio.com",
    projectId: "fan-messages-demo",
    storageBucket: "fan-messages-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// Simulated real-time updates (for demo without Firebase)
let messageUpdateInterval = null;

// Check if Firebase is available
let firebaseApp = null;
let firebaseDb = null;
let firebaseInitialized = false;
let useFirebase = false;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "AIzaSyDemoKey_ReplaceWithYourOwn") {
        firebase.initializeApp(firebaseConfig);
        firebaseDb = firebase.database();
        firebaseInitialized = true;
        useFirebase = true;
        console.log('Firebase initialized successfully - messages will sync across devices');
    } else {
        console.log('Running in demo mode - messages saved locally');
        firebaseInitialized = false;
        useFirebase = false;
    }
} catch (error) {
    console.log('Firebase not available, using localStorage only');
    firebaseInitialized = false;
    useFirebase = false;
}

// ==================== Messages Data Management ====================

const FanMessagesManager = {
    // Get all messages from localStorage
    getAllMessages: function() {
        const messages = localStorage.getItem('fanMessages');
        return messages ? JSON.parse(messages) : this.getDefaultMessages();
    },

    // Save all messages to localStorage
    saveAllMessages: function(messages) {
        localStorage.setItem('fanMessages', JSON.stringify(messages));
        // Sync with Firebase if available
        this.syncToFirebase(messages);
    },

    // Default messages for demo
    getDefaultMessages: function() {
        return [
            {
                id: 1,
                name: 'محب للعنود',
                message: 'أفضل ممثلة سعودية في الجيل الحالي! أداء متميز في كل عمل 💫',
                date: '2025-01-15',
                time: '10:30',
                likes: 15,
                liked: false,
                avatar: '👑'
            },
            {
                id: 2,
                name: 'عاشق الدراما',
                message: 'مسلسل دكة العبيد كان ولا شيء آخر! رحمه شخصية لن أنساها أبداً',
                date: '2025-01-14',
                time: '15:45',
                likes: 22,
                liked: false,
                avatar: '⭐'
            },
            {
                id: 3,
                name: 'صديقة الفن',
                message: 'ماشاء الله تبارك الله! موهبة استثنائية ومميزة. أنت فخرنا',
                date: '2025-01-13',
                time: '09:20',
                likes: 18,
                liked: false,
                avatar: '🌟'
            },
            {
                id: 4,
                name: 'عاشق السينما',
                message: 'أمي كان فيلم رائع جداً! بكيت من القلب مع مشاهد مريم 💔',
                date: '2025-01-12',
                time: '20:15',
                likes: 30,
                liked: false,
                avatar: '🎬'
            },
            {
                id: 5,
                name: 'من السعودية',
                message: 'العنود سعود تمثلنا بشكل صحيح. فنانة مبدعة ومتواضعة',
                date: '2025-01-11',
                time: '14:30',
                likes: 25,
                liked: false,
                avatar: '🇸🇦'
            }
        ];
    },

    // Add new message
    addMessage: function(messageData) {
        const messages = this.getAllMessages();
        const newMessage = {
            id: Date.now(),
            ...messageData,
            date: this.getCurrentDate(),
            time: this.getCurrentTime(),
            likes: 0,
            liked: false,
            authorId: messageData.authorId || messageData.name // Store author identifier
        };
        messages.unshift(newMessage);
        this.saveAllMessages(messages);
        return newMessage;
    },

    // Delete message
    deleteMessage: function(messageId) {
        const messages = this.getAllMessages();
        const filtered = messages.filter(m => m.id !== messageId);
        this.saveAllMessages(filtered);
    },

    // Like/unlike message
    toggleLike: function(messageId) {
        const messages = this.getAllMessages();
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.liked = !message.liked;
            message.likes += message.liked ? 1 : -1;
            this.saveAllMessages(messages);
        }
    },

    // Sync to Firebase
    syncToFirebase: function(messages) {
        if (firebaseInitialized && firebaseDb) {
            firebaseDb.ref('fanMessages').set(messages)
                .then(() => console.log('Synced to Firebase'))
                .catch(err => console.log('Firebase sync error:', err));
        }
    },

    // Load from Firebase
    loadFromFirebase: function() {
        return new Promise((resolve) => {
            if (firebaseInitialized && firebaseDb) {
                firebaseDb.ref('fanMessages').once('value')
                    .then(snapshot => {
                        const data = snapshot.val();
                        if (data) {
                            this.saveAllMessages(data);
                            resolve(data);
                        } else {
                            resolve(this.getAllMessages());
                        }
                    })
                    .catch(err => {
                        console.log('Firebase load error:', err);
                        resolve(this.getAllMessages());
                    });
            } else {
                resolve(this.getAllMessages());
            }
        });
    },

    // Listen for Firebase changes
    listenForChanges: function(callback) {
        if (firebaseInitialized && firebaseDb) {
            firebaseDb.ref('fanMessages').on('value', snapshot => {
                const data = snapshot.val();
                if (data) {
                    this.saveAllMessages(data);
                    callback(data);
                }
            });
        }
    },

    // Get current date
    getCurrentDate: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Get current time
    getCurrentTime: function() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    // Format date for display
    formatDate: function(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `من ${diffDays} أيام`;
        
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Get total count
    getCount: function() {
        return this.getAllMessages().length;
    },

    // Search messages
    search: function(query) {
        const messages = this.getAllMessages();
        const lowerQuery = query.toLowerCase();
        return messages.filter(m => 
            m.message.toLowerCase().includes(lowerQuery) ||
            m.name.toLowerCase().includes(lowerQuery)
        );
    },

    // Filter by recent
    getRecent: function(limit = 10) {
        return this.getAllMessages().slice(0, limit);
    },

    // Get most liked
    getMostLiked: function(limit = 5) {
        return [...this.getAllMessages()]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, limit);
    }
};

// ==================== UI Functions ====================

// Initialize messages section
function initializeMessagesSection() {
    // Load from Firebase first, then from localStorage
    FanMessagesManager.loadFromFirebase().then(() => {
        renderMessages();
        initializeMessageForm();
    });
    
    // Listen for Firebase changes
    FanMessagesManager.listenForChanges(renderMessages);
}

// Render all messages
function renderMessages() {
    const container = document.getElementById('messagesDisplay');
    const messages = FanMessagesManager.getAllMessages();
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="no-messages" id="noMessages">
                <p style="font-size: 1.2em; margin-bottom: 10px;">💬</p>
                <p>لا توجد رسائل حالياً. كن أول من يكتب رسالة للعنود سعود!</p>
            </div>
        `;
    } else {
        container.innerHTML = messages.map(msg => createMessageHTML(msg)).join('');
    }
    
    // Update messages count
    const countSpan = document.getElementById('totalMessages');
    if (countSpan) {
        countSpan.textContent = `(${messages.length})`;
    }
    
    // Update count in header
    const countHeader = document.getElementById('messagesCount');
    if (countHeader) {
        countHeader.textContent = messages.length;
    }
    
    // Update total likes
    const totalLikes = messages.reduce((sum, msg) => sum + msg.likes, 0);
    const totalLikesEl = document.getElementById('totalLikes');
    if (totalLikesEl) {
        totalLikesEl.textContent = totalLikes;
    }
}

// Create message HTML
function createMessageHTML(message) {
    const likeClass = message.liked ? 'liked' : '';
    const likeIcon = message.liked ? '❤️' : '🤍';
    
    // Check if current user is the author
    const currentUser = localStorage.getItem('currentUserName');
    const isAuthor = currentUser && message.authorId === currentUser;
    const deleteButtonHTML = isAuthor ? 
        `<button class="delete-msg-btn" onclick="deleteMessage(${message.id})" title="حذف رسالتك">🗑️</button>` : '';
    
    return `
        <div class="message-card" id="message-${message.id}">
            <div class="message-header">
                <div class="message-avatar">${message.avatar || '👤'}</div>
                <div class="message-info">
                    <strong>${escapeHTML(message.name)}</strong>
                    <span class="msg-date">${FanMessagesManager.formatDate(message.date)}</span>
                </div>
            </div>
            <p class="message-text">${escapeHTML(message.message)}</p>
            <div class="message-actions">
                <button class="heart-btn ${likeClass}" onclick="toggleMessageLike(${message.id})">
                    ${likeIcon} <span class="likes-count">${message.likes}</span>
                </button>
                ${deleteButtonHTML}
            </div>
        </div>
    `;
}

// Initialize message form
function initializeMessageForm() {
    const form = document.getElementById('fanForm');
    const messageInput = document.getElementById('fanMessage');
    const charCount = document.getElementById('charCount');
    
    if (!form) return;
    
    // Load saved username
    const savedName = localStorage.getItem('currentUserName');
    if (savedName) {
        document.getElementById('fanName').value = savedName;
    }
    
    // Character counter
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count + '/500';
            
            if (count > 450) {
                charCount.className = 'char-counter danger';
            } else if (count > 400) {
                charCount.className = 'char-counter warning';
            } else {
                charCount.className = 'char-counter';
            }
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('fanName').value.trim();
        const message = document.getElementById('fanMessage').value.trim();
        
        if (!name) {
            showNotification('يرجى إدخال اسمك', 'error');
            return;
        }
        
        if (!message) {
            showNotification('يرجى كتابة رسالة', 'error');
            return;
        }
        
        if (message.length > 500) {
            showNotification('الرسالة طويلة جداً (حد أقصى 500 حرف)', 'error');
            return;
        }
        
        // Save current user name for identification
        localStorage.setItem('currentUserName', name);
        
        // Create message with author ID
        FanMessagesManager.addMessage({
            name: name,
            message: message,
            avatar: getRandomAvatar(),
            authorId: name // Store author identifier
        });
        
        // Reset form (keep username)
        const savedName = name;
        this.reset();
        document.getElementById('fanName').value = savedName;
        
        // Reset character counter
        if (charCount) {
            charCount.textContent = '0/500';
            charCount.className = 'char-counter';
        }
        
        // Re-render messages
        renderMessages();
        updateLastUpdateTime();
        
        // Scroll to new message
        const firstMessage = document.querySelector('.message-card');
        if (firstMessage) {
            firstMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstMessage.style.animation = 'highlightMessage 1s ease';
        }
        
        // Show success message
        showNotification('شكراً! تم إرسال رسالتك بنجاح 🎉');
    });
}

// Update character count display
function updateCharCount(textarea) {
    const charCount = document.getElementById('charCount');
    if (charCount) {
        const count = textarea.value.length;
        charCount.textContent = count + '/500';
        
        if (count > 450) {
            charCount.className = 'char-counter danger';
        } else if (count > 400) {
            charCount.className = 'char-counter warning';
        } else {
            charCount.className = 'char-counter';
        }
    }
}

// Refresh messages manually
function refreshMessages() {
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        syncStatus.textContent = 'جاري التحديث...';
    }
    
    FanMessagesManager.loadFromFirebase().then(() => {
        renderMessages();
        updateLastUpdateTime();
        
        if (syncStatus) {
            syncStatus.textContent = useFirebase ? 'مزامنة مباشرة' : 'محلي';
        }
        
        showNotification('تم تحديث الرسائل');
    });
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        const time = now.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        lastUpdate.textContent = time;
    }
}

// Import messages prompt
function importMessagesPrompt() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            importMessages(file);
        }
    };
    input.click();
}

// Toggle like on message
function toggleMessageLike(messageId) {
    FanMessagesManager.toggleLike(messageId);
    renderMessages();
}

// Delete message
function deleteMessage(messageId) {
    const messages = FanMessagesManager.getAllMessages();
    const message = messages.find(m => m.id === messageId);
    const currentUser = localStorage.getItem('currentUserName');
    
    // Check if current user is the author
    if (!currentUser || message.authorId !== currentUser) {
        showNotification('لا يمكنك حذف رسالة ليست لك', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف رسالتك؟')) {
        FanMessagesManager.deleteMessage(messageId);
        renderMessages();
        showNotification('تم حذف رسالتك');
    }
}

// Check if user can delete message
function canDeleteMessage(authorId) {
    const currentUser = localStorage.getItem('currentUserName');
    return currentUser && authorId === currentUser;
}

// Get random avatar
function getRandomAvatar() {
    const avatars = ['👤', '😊', '🙂', '😄', '🎭', '⭐', '💫', '🌟', '✨', '👑', '💝', '🎀', '🌸', '🦋', '🌺'];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)'};
        color: #fff;
        padding: 15px 30px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Filter messages
function filterMessages(filter) {
    const messages = FanMessagesManager.getAllMessages();
    const container = document.getElementById('messagesDisplay');
    
    let filtered = messages;
    if (filter === 'recent') {
        filtered = messages.slice(0, 10);
    } else if (filter === 'popular') {
        filtered = [...messages].sort((a, b) => b.likes - a.likes);
    } else if (filter === 'search' && document.getElementById('messageSearch')) {
        const query = document.getElementById('messageSearch').value;
        filtered = FanMessagesManager.search(query);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <p class="no-messages">لا توجد نتائج</p>
        `;
    } else {
        container.innerHTML = filtered.map(msg => createMessageHTML(msg)).join('');
    }
}

// Search messages
function searchMessages(query) {
    filterMessages('search');
}

// Export messages data
function exportMessages() {
    const messages = FanMessagesManager.getAllMessages();
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fan-messages-backup-${FanMessagesManager.getCurrentDate()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('تم تصدير الرسائل!');
}

// Import messages from file
function importMessages(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const messages = JSON.parse(e.target.result);
            if (Array.isArray(messages)) {
                FanMessagesManager.saveAllMessages(messages);
                renderMessages();
                showNotification('تم استيراد الرسائل بنجاح!');
            } else {
                showNotification('ملف غير صالح', 'error');
            }
        } catch (error) {
            showNotification('خطأ في قراءة الملف', 'error');
        }
    };
    reader.readAsText(file);
}

// Add animation styles
const messageAnimationStyles = document.createElement('style');
messageAnimationStyles.textContent = `
    @keyframes highlightMessage {
        0% { background-color: rgba(212, 175, 55, 0.3); }
        100% { background-color: transparent; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
    
    .notification {
        font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif;
    }
    
    .notification.error {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
    }
`;
document.head.appendChild(messageAnimationStyles);

// Make functions globally available
window.toggleMessageLike = toggleMessageLike;
window.deleteMessage = deleteMessage;
window.filterMessages = filterMessages;
window.searchMessages = searchMessages;
window.exportMessages = exportMessages;
window.importMessages = importMessages;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeMessagesSection);

// Export for use in other scripts
window.FanMessagesManager = FanMessagesManager;

// ========================================
// Emoji Guessing Game - Guess the Work from Emojis
// ========================================

const EmojiGame = {
    // Emoji puzzles database - each work represented by emojis
    emojiPuzzles: [
        {
            emojis: '📝💰😰',
            answer: 'مذكرة ابتزاز',
            hint: 'أدخل الرمز',
            year: '2020'
        },
        {
            emojis: '👥📅🔙',
            answer: 'كنا امس',
            hint: 'أدخل الرمز',
            year: '2020'
        },
        {
            emojis: '⏰🔜📅',
            answer: 'بعد حين',
            hint: 'أدخل الرمز',
            year: '2020'
        },
        {
            emojis: '😱💕✅',
            answer: 'ضحايا حلال',
            hint: 'أدخل الرمز',
            year: '2020'
        },
        {
            emojis: '👧🥊',
            answer: 'بنات الملاكمة',
            hint: 'أدخل الرمز',
            year: '2019-2020'
        },
        {
            emojis: '🎬🎤🎭',
            answer: 'ستوديو',
            hint: 'أدخل الرمز',
            year: '2021'
        },
        {
            emojis: '🎮👴👵',
            answer: 'لعبة كبار',
            hint: 'أدخل الرمز',
            year: '2021'
        },
        {
            emojis: '👨‍👩‍👧‍👦👧',
            answer: 'عيال نوف',
            hint: 'أدخل الرمز',
            year: '2022'
        },
        {
            emojis: '🔨🔚',
            answer: 'دكة العبيد',
            hint: 'أدخل الرمز',
            year: '2023'
        },
        {
            emojis: '🏜️❤️👩',
            answer: 'حوجن',
            hint: 'أدخل الرمز',
            year: '2023'
        },
        {
            emojis: '☁️🍽️👩‍🍳',
            answer: 'كلاود كيتشن',
            hint: 'أدخل الرمز',
            year: '2023'
        },
        {
            emojis: '👶❤️👩',
            answer: 'أمي',
            hint: 'أدخل الرمز',
            year: '2025'
        }
    ],

    // Game state
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    timer: null,
    timeLeft: 15,
    maxStreak: 0,

    // Start the game
    startGame: function() {
        // Reset state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;

        // Select 5 random puzzles
        this.currentQuestions = this.shuffleArray([...this.emojiPuzzles]).slice(0, 5);

        // Show quiz screen
        document.getElementById('emojiGameStart').style.display = 'none';
        document.getElementById('emojiResultScreen').classList.remove('active');
        document.getElementById('emojiQuizScreen').classList.add('active');

        // Show first question
        this.showQuestion();
    },

    // Show current question
    showQuestion: function() {
        const question = this.currentQuestions[this.currentQuestionIndex];

        // Update progress
        document.getElementById('emojiQuestionProgress').textContent = 'السؤال ' + (this.currentQuestionIndex + 1) + ' من 5';
        document.getElementById('emojiCurrentScore').textContent = 'النتيجة: ' + this.score;
        document.getElementById('emojiProgressFill').style.width = ((this.currentQuestionIndex / 5) * 100) + '%';

        // Update question number
        document.getElementById('emojiQuestionNumber').textContent = 'السؤال #' + (this.currentQuestionIndex + 1);

        // Show emojis
        document.getElementById('emojiDisplay').textContent = question.emojis;

        // Show hint
        document.getElementById('emojiHintText').textContent = '💡 تلميح: ' + question.hint;

        // Generate wrong options from other works
        const wrongOptions = this.emojiPuzzles
            .filter(p => p.answer !== question.answer)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(p => p.answer);

        // Combine and shuffle options
        const allOptions = this.shuffleArray([question.answer, ...wrongOptions]);

        // Generate options HTML
        const optionsGrid = document.getElementById('emojiOptionsGrid');
        optionsGrid.innerHTML = '';

        for (let i = 0; i < allOptions.length; i++) {
            const option = allOptions[i];
            const btn = document.createElement('button');
            btn.className = 'emoji-option-btn';
            btn.textContent = option;
            btn.onclick = (function(selected, correctAnswer) {
                return function() {
                    EmojiGame.checkAnswer(selected, correctAnswer);
                };
            })(option, question.answer);
            optionsGrid.appendChild(btn);
        }

        // Hide feedback and next button
        document.getElementById('emojiFeedback').classList.remove('show', 'correct', 'wrong');
        document.getElementById('emojiNextBtn').classList.remove('show');

        // Reset streak display
        document.getElementById('emojiStreak').style.display = 'none';

        // Start timer
        this.startTimer();
    },

    // Start countdown timer
    startTimer: function() {
        this.timeLeft = 15;
        this.updateTimerDisplay();

        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.timeOut();
            }
        }, 1000);
    },

    // Update timer display
    updateTimerDisplay: function() {
        const timerEl = document.getElementById('emojiTimerValue');
        timerEl.textContent = this.timeLeft + 's';

        timerEl.classList.remove('warning', 'danger');
        if (this.timeLeft <= 5) {
            timerEl.classList.add('danger');
        } else if (this.timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
    },

    // Handle time out
    timeOut: function() {
        clearInterval(this.timer);

        const question = this.currentQuestions[this.currentQuestionIndex];

        // Disable all options
        const allOptions = document.querySelectorAll('.emoji-option-btn');
        allOptions.forEach(opt => opt.classList.add('disabled'));

        // Show correct answer
        allOptions.forEach(opt => {
            if (opt.textContent === question.answer) {
                opt.classList.add('correct');
            }
        });

        this.streak = 0;
        this.wrongAnswers++;

        // Show feedback
        document.getElementById('emojiFeedback').textContent = '⏰ انتهى الوقت! الإجابة الصحيحة: ' + question.answer;
        document.getElementById('emojiFeedback').className = 'emoji-feedback show wrong';

        // Show next button
        document.getElementById('emojiNextBtn').classList.add('show');
    },

    // Check answer
    checkAnswer: function(selected, correct) {
        clearInterval(this.timer);

        // Disable all options
        const allOptions = document.querySelectorAll('.emoji-option-btn');
        allOptions.forEach(opt => opt.classList.add('disabled'));

        if (selected === correct) {
            // Correct answer
            event.target.classList.add('correct');

            // Calculate score with time bonus
            const timeBonus = this.timeLeft * 2;
            const questionScore = 20 + timeBonus;
            this.score += questionScore;
            this.correctAnswers++;
            this.streak++;

            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }

            // Show streak
            if (this.streak >= 2) {
                document.getElementById('emojiStreakCount').textContent = this.streak;
                document.getElementById('emojiStreak').style.display = 'flex';
            }

            // Update score display
            document.getElementById('emojiCurrentScore').textContent = 'النتيجة: ' + this.score;

            // Show feedback
            const feedbackMessages = [
                'ممتاز 👌 🤩',
            ];
            document.getElementById('emojiFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('emojiFeedback').className = 'emoji-feedback show correct';
        } else {
            // Wrong answer
            event.target.classList.add('wrong');
            this.streak = 0;
            this.wrongAnswers++;

            // Highlight correct answer
            allOptions.forEach(opt => {
                if (opt.textContent === correct) {
                    opt.classList.add('correct');
                }
            });

            // Show feedback
            const feedbackMessages = [
                '❌ إجابة خاطئة! حاول مرة أخرى',
            ];
            document.getElementById('emojiFeedback').textContent = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            document.getElementById('emojiFeedback').className = 'emoji-feedback show wrong';
        }

        // Show next button
        document.getElementById('emojiNextBtn').classList.add('show');
    },

    // Next question
    nextQuestion: function() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < 5) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    },

    // Show results
    showResults: function() {
        clearInterval(this.timer);

        // Hide quiz screen, show result screen
        document.getElementById('emojiQuizScreen').classList.remove('active');
        document.getElementById('emojiResultScreen').classList.add('active');

        // Update progress bar
        document.getElementById('emojiProgressFill').style.width = '100%';

        // Update final stats
        document.getElementById('emojiFinalScore').textContent = this.score;
        document.getElementById('emojiCorrectAnswers').textContent = this.correctAnswers;
        document.getElementById('emojiWrongAnswers').textContent = this.wrongAnswers;
        document.getElementById('emojiMaxStreak').textContent = this.maxStreak;

        // Set emoji and title based on score
        let emoji = '💪';
        let title = 'حاول مرة أخرى!';
        let message = 'لا بأس! حاول مرة أخرى لتحسين نتيجتك!';
        let badge = '';

        if (this.score >= 120) {
            emoji = '🏆';
            title = 'قائد Emoji!';
            message = 'ممتاز! أنت خبير في رموز العنود سعود!';
            badge = 'المستوى: محترف';
        } else if (this.score >= 100) {
            emoji = '🌟';
            title = 'نجم Emoji!';
            message = 'رائع جداً! معرفة ممتازة بأعمالها!';
            badge = 'المستوى: متقدم';
        } else if (this.score >= 80) {
            emoji = '👍';
            title = 'متقن Emoji!';
            message = 'جيد جداً! أداء متميز!';
            badge = 'المستوى: متوسط';
        } else if (this.score >= 60) {
            emoji = '😊';
            title = 'واعد!';
            message = 'لديك معرفة جيدة. استمر في التعلم!';
            badge = 'المستوى: مبتدئ';
        } else {
            emoji = '💪';
            title = 'ابدأ من جديد!';
            message = 'لا بأس! كل لاعب يبدأ من somewhere!';
            badge = 'المستوى: مبتدئ';
        }

        document.getElementById('emojiResultEmoji').textContent = emoji;
        document.getElementById('emojiResultTitle').textContent = title;
        document.getElementById('emojiResultMessage').textContent = message;

        // Add level badge if exists
        const badgeContainer = document.getElementById('emojiLevelBadge');
        if (badge) {
            badgeContainer.textContent = badge;
            badgeContainer.style.display = 'inline-flex';
        } else {
            badgeContainer.style.display = 'none';
        }

        // Save high score
        const savedHighScore = localStorage.getItem('emojiGameHighScore') || 0;
        if (this.score > savedHighScore) {
            localStorage.setItem('emojiGameHighScore', this.score);
            document.getElementById('emojiNewHighScore').style.display = 'block';
        } else {
            document.getElementById('emojiNewHighScore').style.display = 'none';
        }
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
function startEmojiGame() {
    EmojiGame.startGame();
}

function nextEmojiQuestion() {
    EmojiGame.nextQuestion();
}

// Export
window.EmojiGame = EmojiGame;
window.startEmojiGame = startEmojiGame;
window.nextEmojiQuestion = nextEmojiQuestion;

