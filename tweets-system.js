// نظام التغريدات - Twitter-like System
// Uses localStorage for persistence (all tweets saved and visible to everyone)

// ==================== Tweets Data Management ====================

const TweetsManager = {
    // Get all tweets from localStorage
    getAllTweets: function() {
        const tweets = localStorage.getItem('anoudSaudTweets');
        return tweets ? JSON.parse(tweets) : this.getDefaultTweets();
    },

    // Save all tweets to localStorage
    saveAllTweets: function(tweets) {
        localStorage.setItem('anoudSaudTweets', JSON.stringify(tweets));
    },

    // Default tweets for demo
    getDefaultTweets: function() {
        return [
            {
                id: 1,
                author: 'محب للعنود',
                content: 'أفضل ممثلة سعودية في الجيل الحالي! أداء متميز في كل عمل 💫',
                image: null,
                date: '2025-01-15',
                time: '10:30',
                likes: 15,
                retweets: 3,
                replies: 5,
                liked: false,
                avatar: '👤'
            },
            {
                id: 2,
                author: 'عاشق الدراما',
                content: 'مسلسل دكة العبيد كان ولا شيء آخر! رحمه شخصية لن أنساها',
                image: null,
                date: '2025-01-14',
                time: '15:45',
                likes: 22,
                retweets: 7,
                replies: 8,
                liked: false,
                avatar: '🎬'
            },
            {
                id: 3,
                author: 'صديقة الفن',
                'content': 'ماشاء الله تبارك الله! موهبة استثنائية ومميزة',
                image: null,
                date: '2025-01-13',
                time: '09:20',
                likes: 18,
                retweets: 4,
                replies: 3,
                liked: false,
                avatar: '⭐'
            }
        ];
    },

    // Add new tweet
    addTweet: function(tweetData) {
        const tweets = this.getAllTweets();
        const newTweet = {
            id: Date.now(),
            ...tweetData,
            date: this.getCurrentDate(),
            time: this.getCurrentTime(),
            likes: 0,
            retweets: 0,
            replies: 0,
            liked: false
        };
        tweets.unshift(newTweet);
        this.saveAllTweets(tweets);
        return newTweet;
    },

    // Delete tweet
    deleteTweet: function(tweetId) {
        const tweets = this.getAllTweets();
        const filtered = tweets.filter(t => t.id !== tweetId);
        this.saveAllTweets(filtered);
    },

    // Like/unlike tweet
    toggleLike: function(tweetId) {
        const tweets = this.getAllTweets();
        const tweet = tweets.find(t => t.id === tweetId);
        if (tweet) {
            tweet.liked = !tweet.liked;
            tweet.likes += tweet.liked ? 1 : -1;
            this.saveAllTweets(tweets);
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
    }
};

// ==================== UI Functions ====================

// Initialize tweets section
function initializeTweetsSection() {
    renderTweets();
    initializeTweetForm();
}

// Render all tweets
function renderTweets() {
    const container = document.getElementById('tweetsContainer');
    const tweets = TweetsManager.getAllTweets();
    
    container.innerHTML = tweets.map(tweet => createTweetHTML(tweet)).join('');
    
    // Update tweets count
    const tweetsCount = document.getElementById('tweetsCount');
    if (tweetsCount) {
        tweetsCount.textContent = tweets.length;
    }
}

// Create tweet HTML
function createTweetHTML(tweet) {
    const imageHTML = tweet.image ? 
        `<div class="tweet-image-container">
            <img src="${tweet.image}" alt="صورة التغريدة" class="tweet-image" onclick="openImageModal('${tweet.image}')">
        </div>` : '';
    
    const likeClass = tweet.liked ? 'liked' : '';
    const likeIcon = tweet.liked ? '❤️' : '🤍';
    
    return `
        <div class="tweet-card" id="tweet-${tweet.id}">
            <div class="tweet-avatar">${tweet.avatar || '👤'}</div>
            <div class="tweet-content-wrapper">
                <div class="tweet-header">
                    <span class="tweet-author">${escapeHTML(tweet.author)}</span>
                    <span class="tweet-time">@${escapeHTML(tweet.author)} · ${TweetsManager.formatDate(tweet.date)}</span>
                </div>
                <p class="tweet-text">${escapeHTML(tweet.content)}</p>
                ${imageHTML}
                <div class="tweet-actions">
                    <button class="tweet-action-btn reply-btn" onclick="showReplyModal(${tweet.id})">
                        <span class="action-icon">💬</span>
                        <span class="action-count">${tweet.replies > 0 ? tweet.replies : ''}</span>
                    </button>
                    <button class="tweet-action-btn retweet-btn" onclick="retweet(${tweet.id})">
                        <span class="action-icon">🔁</span>
                        <span class="action-count">${tweet.retweets > 0 ? tweet.retweets : ''}</span>
                    </button>
                    <button class="tweet-action-btn like-btn ${likeClass}" onclick="toggleTweetLike(${tweet.id})">
                        <span class="action-icon">${likeIcon}</span>
                        <span class="action-count">${tweet.likes > 0 ? tweet.likes : ''}</span>
                    </button>
                    <button class="tweet-action-btn share-btn" onclick="shareTweet(${tweet.id})">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
            <button class="delete-tweet-btn" onclick="deleteTweet(${tweet.id})" title="حذف">🗑️</button>
        </div>
    `;
}

// Initialize tweet form
function initializeTweetForm() {
    const form = document.getElementById('tweetForm');
    const textInput = document.getElementById('tweetTextInput');
    const imageInput = document.getElementById('tweetImageInput');
    const imagePreview = document.getElementById('tweetImagePreview');
    const removeImageBtn = document.getElementById('removeTweetImage');
    
    // Character count
    textInput.addEventListener('input', function() {
        const count = this.value.length;
        const counter = document.getElementById('tweetCharCount');
        counter.textContent = count;
        
        if (count > 280) {
            counter.style.color = '#e74c3c';
        } else {
            counter.style.color = '#8b949e';
        }
    });
    
    // Image preview
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    removeImageBtn.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            } else {
                alert('يرجى اختيار صورة صحيحة (PNG, JPG, GIF) بحجم أقل من 5 ميجابايت');
                this.value = '';
            }
        }
    });
    
    // Remove image
    removeImageBtn.addEventListener('click', function() {
        imageInput.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        this.style.display = 'none';
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const author = document.getElementById('tweetAuthor').value.trim();
        const content = textInput.value.trim();
        const image = imagePreview.src;
        
        if (!author) {
            alert('يرجى إدخال اسمك');
            return;
        }
        
        if (!content && !image) {
            alert('يرجى كتابة نص أو اختيار صورة');
            return;
        }
        
        // Create tweet
        TweetsManager.addTweet({
            author: author,
            content: content,
            image: image && imagePreview.style.display !== 'none' ? image : null,
            avatar: getRandomAvatar()
        });
        
        // Reset form
        this.reset();
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        document.getElementById('tweetCharCount').textContent = '0';
        
        // Re-render tweets
        renderTweets();
        
        // Scroll to new tweet
        const firstTweet = document.querySelector('.tweet-card');
        if (firstTweet) {
            firstTweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstTweet.style.animation = 'highlightTweet 1s ease';
        }
        
        // Show success message
        showNotification('تم نشر تغريدتك بنجاح! 🎉');
    });
}

// Toggle like on tweet
function toggleTweetLike(tweetId) {
    TweetsManager.toggleLike(tweetId);
    renderTweets();
}

// Delete tweet
function deleteTweet(tweetId) {
    if (confirm('هل أنت متأكد من حذف هذه التغريدة؟')) {
        TweetsManager.deleteTweet(tweetId);
        renderTweets();
        showNotification('تم حذف التغريدة');
    }
}

// Retweet
function retweet(tweetId) {
    const tweets = TweetsManager.getAllTweets();
    const original = tweets.find(t => t.id === tweetId);
    if (original) {
        const retweetContent = original.content;
        TweetsManager.addTweet({
            author: 'أنت',
            content: '🔁 تم إعادة التغريد: ' + retweetContent,
            image: original.image,
            avatar: '🔄'
        });
        showNotification('تم إعادة التغريد!');
    }
}

// Share tweet
function shareTweet(tweetId) {
    const tweet = TweetsManager.getAllTweets().find(t => t.id === tweetId);
    if (tweet) {
        const shareText = `${tweet.author}: ${tweet.content}`;
        if (navigator.share) {
            navigator.share({
                title: 'تغريدة من العنود سعود',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('تم نسخ النص!');
            });
        }
    }
}

// Reply modal (placeholder)
function showReplyModal(tweetId) {
    const tweet = TweetsManager.getAllTweets().find(t => t.id === tweetId);
    if (tweet) {
        const replyContent = prompt(`الرد على تغريدة ${tweet.author}:\n\nأكتب ردك هنا:`);
        if (replyContent) {
            showNotification('تم إرسال الرد! (ميزة_reply قادمة)');
        }
    }
}

// Get random avatar
function getRandomAvatar() {
    const avatars = ['👤', '😊', '🙂', '😄', '🎭', '⭐', '💫', '🌟', '✨', '👑'];
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
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
        color: #0d1117;
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

// Open image in modal
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-overlay" onclick="this.parentElement.remove()"></div>
        <img src="${imageSrc}" alt="صورة مكبرة" class="image-modal-content">
    `;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(modal);
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes highlightTweet {
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
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .image-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }
    
    .image-modal-content {
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        animation: zoomIn 0.3s ease;
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(animationStyles);

// Filter tweets
function filterTweets(filter) {
    const tweets = TweetsManager.getAllTweets();
    const container = document.getElementById('tweetsContainer');
    
    let filteredTweets = tweets;
    if (filter === 'media') {
        filteredTweets = tweets.filter(t => t.image);
    } else if (filter === 'likes') {
        filteredTweets = [...tweets].sort((a, b) => b.likes - a.likes);
    }
    
    container.innerHTML = filteredTweets.map(tweet => createTweetHTML(tweet)).join('');
}

// Search tweets
function searchTweets(query) {
    const tweets = TweetsManager.getAllTweets();
    const container = document.getElementById('tweetsContainer');
    
    const filtered = tweets.filter(t => 
        t.content.toLowerCase().includes(query.toLowerCase()) ||
        t.author.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-tweets">لا توجد نتائج بحث</p>';
    } else {
        container.innerHTML = filtered.map(tweet => createTweetHTML(tweet)).join('');
    }
}

// Export tweets data
function exportTweets() {
    const tweets = TweetsManager.getAllTweets();
    const dataStr = JSON.stringify(tweets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tweets-backup-${TweetsManager.getCurrentDate()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('تم تصدير التغريدات!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeTweetsSection);

// Make functions globally available
window.toggleTweetLike = toggleTweetLike;
window.deleteTweet = deleteTweet;
window.retweet = retweet;
window.shareTweet = shareTweet;
window.showReplyModal = showReplyModal;
window.openImageModal = openImageModal;
window.filterTweets = filterTweets;
window.searchTweets = searchTweets;
window.exportTweets = exportTweets;

