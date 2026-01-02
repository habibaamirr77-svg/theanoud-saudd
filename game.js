// ========================================
// Anoud Saud Website - Main JavaScript
// ========================================

// Loading Screen with Enhanced Animations
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading');
    const spinner = loadingScreen.querySelector('.loading-spinner');
    
    // Add spinning animation to loading
    spinner.style.animation = 'spin 1s linear infinite, pulse 1.5s ease-in-out infinite';
    
    setTimeout(function() {
        loadingScreen.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(1.5)';
        
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none';
            // Trigger entrance animation for header
            animateHeader();
        }, 800);
    }, 1500);
});

// Header Animation
function animateHeader() {
    const header = document.querySelector('header');
    const profile = document.querySelector('.profile-container');
    const title = document.querySelector('header h1');
    const subtitle = document.querySelector('header p');
    
    header.style.opacity = '0';
    header.style.transform = 'translateY(-50px)';
    
    setTimeout(function() {
        header.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    profile.style.opacity = '0';
    profile.style.transform = 'scale(0) rotate(-360deg)';
    
    setTimeout(function() {
        profile.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        profile.style.opacity = '1';
        profile.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
    
    title.style.opacity = '0';
    title.style.transform = 'translateY(30px) scale(0.8)';
    
    setTimeout(function() {
        title.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0) scale(1)';
    }, 500);
    
    subtitle.style.opacity = '0';
    
    setTimeout(function() {
        subtitle.style.transition = 'all 0.6s ease-out';
        subtitle.style.opacity = '1';
    }, 700);
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections on scroll
    animateSectionsOnScroll();
    
    // Add hover effects to cards
    addCardHoverEffects();
    
    // Animate navigation
    animateNavigation();
});

// Sections Scroll Animation
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        observer.observe(section);
    });
}

// Add hover effects to cards
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.works li, .message-card, .post-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Navigation Animation
function animateNavigation() {
    const nav = document.querySelector('nav');
    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-20px)';
    
    setTimeout(function() {
        nav.style.transition = 'all 0.5s ease-out';
        nav.style.opacity = '1';
        nav.style.transform = 'translateY(0)';
    }, 800);
    
    // Add smooth scroll to nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    var isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('lightMode', isLightMode);
}

if (localStorage.getItem('lightMode') === 'true') {
    document.body.classList.add('light-mode');
}

// Profile Picture Change
function changeProfilePicture(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
            localStorage.setItem('profilePicture', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

if (localStorage.getItem('profilePicture')) {
    document.getElementById('profileImage').src = localStorage.getItem('profilePicture');
}

// Scroll to Top Button
var scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Series Summary Modal
var seriesData = {
    'مذكرة ابتزاز': { year: '2020', role: 'هديل', summary: 'مسلسل درامي سعودي يروي قصة هديل.' },
    'كنا امس': { year: '2020', role: 'لميس', summary: 'مسلسل يعكس قصص الشباب السعودي.' },
    'بعد حين': { year: '2020', role: 'خلود', summary: 'مسلسل درامي يستكشف موضوعات اجتماعية.' },
    'ضحايا حلال': { year: '2020', role: 'ملك', summary: 'مسلسل يتناول قصص واقعية.' },
    'بنات الملاكمة': { year: '2019-2020', role: 'شمس', summary: 'مسلسل يروي قصص فتيات يمارسن الملاكمة.' },
    'ستوديو': { year: '2021', role: 'أميرة', summary: 'مسلسل يستكشف عالم الإنتاج الفني.' },
    'لعبة كبار': { year: '2021', role: 'مرزوقة', summary: 'مسلسل كوميدي.' },
    'عيال نوف': { year: '2022', role: 'صمود', summary: 'مسلسل عائلي.' },
    'دكة العبيد': { year: '2023', role: 'رحمه', summary: 'مسلسل تاريخي.' },
    'حوجن': { year: '2023', role: 'جمارى', summary: 'مسلسل سعودي معاصر.' },
    'كلاود كيتشن': { year: '2023', role: 'عبير', summary: 'مسلسل يروي قصص الطهاة.' },
    'أمي': { year: '2025', role: 'مريم', summary: 'مسلسل يروي قصص الأمومة.' }
};

function showSeriesSummary(title, year, role) {
    var modal = document.getElementById('seriesSummaryModal');
    var data = seriesData[title] || { year: year, role: role.replace('🎭 دور ', ''), summary: 'مسلسل سعودي مميز' };
    
    document.getElementById('modalSeriesTitle').textContent = title;
    document.getElementById('modalSeriesYear').textContent = data.year;
    document.getElementById('modalSeriesSummary').textContent = '🎭 دور ' + data.role + '\n\n' + data.summary;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSeriesSummary() {
    document.getElementById('seriesSummaryModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('seriesSummaryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSeriesSummary();
    }
});

// Filter Buttons for TV Series
var filterBtns = document.querySelectorAll('.filter-btn');
var works = document.querySelectorAll('.works li');

filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        var filter = this.dataset.filter;
        
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        
        works.forEach(function(work) {
            if (filter === 'all' || work.dataset.year === filter || 
                (filter === '2019' && (work.dataset.year === '2019-2020' || work.dataset.year === '2019'))) {
                work.style.display = 'block';
                work.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                work.style.display = 'none';
            }
        });
    });
});

// Timeline Section
var timelineData = [
    { year: '2019-2020', works: ['بنات الملاكمة'], color: '#d4af37' },
    { year: '2020', works: ['مذكرة ابتزاز', 'كنا امس', 'بعد حين', 'ضحايا حلال'], color: '#911e69' },
    { year: '2021', works: ['ستوديو', 'لعبة كبار'], color: '#d437b7' },
    { year: '2022', works: ['عيال نوف'], color: '#e040fb' },
    { year: '2023', works: ['دكة العبيد', 'حوجن', 'كلاود كيتشن'], color: '#7c4dff' },
    { year: '2025', works: ['أمي'], color: '#536dfe' }
];

// Timeline Works Display
function showYearWorks(index) {
    var yearData = timelineData[index];
    
    animateCar(index);
    
    var car = document.getElementById('cartoonCar');
    car.style.setProperty('--car-pos', (15 + (index * 17)) + '%');
    
    var dots = document.querySelectorAll('.timeline-dot');
    dots.forEach(function(dot, i) {
        dot.style.transform = i === index ? 'scale(1.4)' : 'scale(1)';
        dot.style.boxShadow = i === index ? '0 0 25px ' + timelineData[i].color : 'none';
    });
    
    // Update works display
    updateWorksDisplay(yearData);
}

function updateWorksDisplay(yearData) {
    var displayContainer = document.getElementById('timelineWorksDisplay');
    
    if (!displayContainer) {
        // Create the display container if it doesn't exist
        var roadContainer = document.querySelector('.road-container');
        displayContainer = document.createElement('div');
        displayContainer.id = 'timelineWorksDisplay';
        displayContainer.className = 'timeline-works-display';
        displayContainer.innerHTML = '<h3>أعمال عام <span class="year-display"></span></h3><div class="timeline-works-list"></div>';
        roadContainer.parentNode.insertBefore(displayContainer, roadContainer.nextSibling);
    }
    
    var yearDisplay = displayContainer.querySelector('.year-display');
    var worksList = displayContainer.querySelector('.timeline-works-list');
    
    yearDisplay.textContent = yearData.year;
    
    // Clear and add works with animation
    worksList.innerHTML = '';
    yearData.works.forEach(function(work, index) {
        var item = document.createElement('span');
        item.className = 'timeline-work-item';
        item.textContent = work;
        item.style.animationDelay = (index * 0.1) + 's';
        item.onclick = function() {
            var workElement = document.querySelector('.works li strong');
            if (workElement) {
                var parent = workElement.closest('li');
                if (parent) {
                    parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    parent.style.animation = 'none';
                    setTimeout(function() {
                        parent.style.animation = 'workPopIn 0.5s ease-out';
                    }, 10);
                }
            }
        };
        worksList.appendChild(item);
    });
}

function initTimeline() {
    var markersContainer = document.getElementById('yearMarkers');
    var navContainer = document.getElementById('timelineNav');
    
    if (!markersContainer || !navContainer) return;
    
    timelineData.forEach(function(data, index) {
        var marker = document.createElement('div');
        marker.className = 'year-marker';
        marker.innerHTML = '<span class="year-number">' + data.year + '</span>';
        marker.style.left = (15 + (index * 17)) + '%';
        marker.style.animationDelay = (index * 0.1) + 's';
        marker.onclick = function() { showYearWorks(index); };
        markersContainer.appendChild(marker);
        
        var dot = document.createElement('button');
        dot.className = 'timeline-dot';
        dot.style.backgroundColor = data.color;
        dot.onclick = function() { showYearWorks(index); };
        navContainer.appendChild(dot);
    });
    
    animateCar(0);
    
    // Show first year's works after a short delay
    setTimeout(function() {
        showYearWorks(0);
    }, 1000);
}

function animateCar(targetIndex) {
    var car = document.getElementById('cartoonCar');
    if (!car) return;
    
    var targetPosition = 15 + (targetIndex * 17);
    
    // Add driving animation
    car.style.transition = 'left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    car.style.left = targetPosition + '%';
    
    // Increase wheel spin animation
    var wheels = car.querySelectorAll('.car-wheel');
    wheels.forEach(function(wheel) {
        wheel.style.animation = 'wheelSpin 0.1s linear infinite';
        setTimeout(function() {
            wheel.style.animation = 'wheelSpin 0.3s linear infinite';
        }, 1500);
    });
    
    // Smoke effect
    var exhaust = car.querySelector('.car-exhaust .smoke');
    if (exhaust) {
        exhaust.style.animation = 'none';
        setTimeout(function() {
            exhaust.style.animation = 'smokeRise 1s ease-out infinite';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initTimeline();
});

// Post Upload Functions - Professional Version
var posts = [];
var currentUploadType = 'image';
var postsPerPage = 6;
var currentPage = 1;

// Initialize posts
function initPosts() {
    var saved = localStorage.getItem('anoudPosts');
    if (saved) {
        posts = JSON.parse(saved);
    }
    updatePostCount();
    renderPosts();
}

function selectUploadType(type) {
    currentUploadType = type;
    
    document.querySelectorAll('.upload-type-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.upload-section').forEach(function(section) {
        section.classList.remove('active');
    });
    
    var activeSection = document.getElementById(type + 'UploadSection');
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

function handleImageUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة');
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = '<img src="' + e.target.result + '" class="preview-image" alt="معاينة الصورة">';
            preview.classList.add('active');
        }
        
        addPost('image', e.target.result);
        
        event.target.value = '';
        setTimeout(function() {
            if (preview) {
                preview.classList.remove('active');
                preview.innerHTML = '';
            }
        }, 2000);
    };
    reader.readAsDataURL(file);
}

function handleVideoUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
        alert('يرجى اختيار ملف فيديو');
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById('videoPreview');
        if (preview) {
            preview.innerHTML = '<video src="' + e.target.result + '" class="preview-video" controls></video>';
            preview.classList.add('active');
        }
        
        addPost('video', e.target.result);
        
        event.target.value = '';
        setTimeout(function() {
            if (preview) {
                preview.classList.remove('active');
                preview.innerHTML = '';
            }
        }, 2000);
    };
    reader.readAsDataURL(file);
}

function addTextPost() {
    var text = document.getElementById('postTextInput');
    if (!text) return;
    
    var content = text.value.trim();
    if (!content) {
        alert('يرجى كتابة نص للمنشور');
        return;
    }
    
    addPost('text', content);
    text.value = '';
}

function addPost(type, content) {
    var post = {
        id: Date.now(),
        type: type,
        content: content,
        date: new Date().toLocaleDateString('ar-SA'),
        time: new Date().toISOString(),
        likes: 0,
        liked: false
    };
    
    posts.unshift(post);
    savePosts();
    updatePostCount();
    renderPosts();
    showNotification('تم نشر المنشور بنجاح! 🎉');
}

function deletePost(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    
    posts = posts.filter(function(p) { return p.id !== id; });
    savePosts();
    updatePostCount();
    renderPosts();
    showNotification('تم حذف المنشور');
}

function toggleLike(id) {
    var post = posts.find(function(p) { return p.id === id; });
    if (!post) return;
    
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    savePosts();
    renderPosts();
}

function updatePostCount() {
    var totalSpan = document.getElementById('totalPosts');
    if (totalSpan) {
        totalSpan.textContent = '(' + posts.length + ')';
    }
}

function renderPosts(filter) {
    if (filter === undefined) filter = 'all';
    
    var grid = document.getElementById('postsGrid');
    if (!grid) return;
    
    var filteredPosts = filter === 'all' ? posts : posts.filter(function(p) { return p.type === filter; });
    
    updatePostCount();
    
    if (filteredPosts.length === 0) {
        grid.innerHTML = '<div class="empty-state" id="emptyPosts">' +
            '<div class="empty-icon">📭</div>' +
            '<h3>لا توجد منشورات بعد</h3>' +
            '<p>كن أول من يشارك!</p>' +
            '<button class="empty-action" onclick="scrollToSection(\'posts\')">➕ أضف منشور</button>' +
            '</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    filteredPosts.forEach(function(post, index) {
        var card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = (index * 0.1) + 's';
        
        var typeIcon = '';
        var typeLabel = '';
        var contentHtml = '';
        
        switch(post.type) {
            case 'image':
                typeIcon = '🖼️';
                typeLabel = 'صورة';
                contentHtml = '<img src="' + post.content + '" class="post-image" alt="منشور صورة">';
                break;
            case 'video':
                typeIcon = '🎬';
                typeLabel = 'فيديو';
                contentHtml = '<video src="' + post.content + '" class="post-video" controls></video>';
                break;
            case 'text':
                typeIcon = '📝';
                typeLabel = 'نص';
                contentHtml = '<div class="post-text">' + escapeHtml(post.content) + '</div>';
                break;
        }
        
        card.innerHTML = 
            '<div class="post-header">' +
                '<span class="post-type-badge"><span class="type-icon">' + typeIcon + '</span> ' + typeLabel + '</span>' +
                '<div class="post-actions">' +
                    '<button class="post-action-btn" onclick="sharePost(' + post.id + ')" title="مشاركة">📤</button>' +
                    '<button class="post-action-btn delete" onclick="deletePost(' + post.id + ')" title="حذف">🗑️</button>' +
                '</div>' +
            '</div>' +
            '<div class="post-content">' + contentHtml + '</div>' +
            '<div class="post-footer">' +
                '<div class="post-stats">' +
                    '<span class="post-stat ' + (post.liked ? 'liked' : '') + '" onclick="toggleLike(' + post.id + ')">' +
                        (post.liked ? '❤️' : '🤍') + ' ' + post.likes +
                    '</span>' +
                '</div>' +
                '<span class="post-time">' + getTimeAgo(post.time) + '</span>' +
            '</div>';
        
        grid.appendChild(card);
    });
}

function filterPosts(filter) {
    document.querySelectorAll('.post-tab').forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        }
    });
    
    renderPosts(filter);
}

function savePosts() {
    localStorage.setItem('anoudPosts', JSON.stringify(posts));
}

function loadPosts() {
    initPosts();
}

function sharePost(id) {
    var post = posts.find(function(p) { return p.id === id; });
    if (!post) return;
    
    var shareText = post.type === 'text' ? post.content : 'تحقق من هذا المنشور من العنود سعود!';
    
    if (navigator.share) {
        navigator.share({
            title: 'منشور من العنود سعود',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText + ' - ' + window.location.href);
        showNotification('تم نسخ الرابط! 📋');
    }
}

function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = 
        'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);' +
        'background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); color: #0d1117;' +
        'padding: 15px 30px; border-radius: 30px; font-weight: bold; z-index: 4000;' +
        'box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4); animation: notificationSlide 3s ease forwards;';
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'notificationFade 0.5s ease forwards';
        setTimeout(function() { notification.remove(); }, 500);
    }, 2500);
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(dateString) {
    var date = new Date(dateString);
    var now = new Date();
    var seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'الآن';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'د';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'س';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'ي';
    return date.toLocaleDateString('ar-SA');
}

// Fan Messages Section - Improved with better visibility
var messages = [];

function initMessages() {
    var saved = localStorage.getItem('anoudMessages');
    if (saved) {
        messages = JSON.parse(saved);
    }
    renderMessages();
}

function renderMessages() {
    var display = document.getElementById('messagesDisplay');
    
    // Update total count
    var totalSpan = document.getElementById('totalMessages');
    if (totalSpan) {
        totalSpan.textContent = '(' + messages.length + ')';
    }
    
    if (messages.length === 0) {
        display.innerHTML = '<div class="no-messages" id="noMessages">' +
            '<div class="empty-icon">💬</div>' +
            '<h3>لا توجد رسائل حالياً</h3>' +
            '<p>كن أول من يكتب رسالة للعنود سعود!</p>' +
            '</div>';
        return;
    }
    
    // Create container for messages with animation
    var messagesContainer = document.createElement('div');
    messagesContainer.className = 'messages-container';
    messagesContainer.innerHTML = '<div class="messages-grid" id="messagesGrid"></div>';
    
    var grid = messagesContainer.querySelector('#messagesGrid');
    display.innerHTML = '';
    display.appendChild(messagesContainer);
    
    // Render all messages with staggered animation
    messages.forEach(function(msg, index) {
        var card = document.createElement('div');
        card.className = 'message-card';
        card.style.animationDelay = (index * 0.1) + 's';
        
        var timeAgo = getTimeAgo(msg.timestamp || msg.id);
        
        card.innerHTML = 
            '<div class="message-content">' +
                '<div class="message-header">' +
                    '<div class="message-avatar">' + getInitials(msg.name) + '</div>' +
                    '<div class="message-info">' +
                        '<strong class="message-name">' + escapeHtml(msg.name) + '</strong>' +
                        '<span class="message-date">' + timeAgo + '</span>' +
                    '</div>' +
                    '<div class="message-badge">رسالة جديدة</div>' +
                '</div>' +
                '<div class="message-body">' +
                    '<p>' + escapeHtml(msg.message) + '</p>' +
                '</div>' +
                '<div class="message-footer">' +
                    '<div class="message-actions">' +
                        '<button class="action-btn like-btn ' + (msg.liked ? 'liked' : '') + '" onclick="likeMessage(' + msg.id + ', this)">' +
                            '<span class="heart-icon">' + (msg.liked ? '❤️' : '🤍') + '</span>' +
                            '<span class="like-text">' + (msg.liked ? 'معجب' : 'أعجبني') + '</span>' +
                        '</button>' +
                        '<span class="likes-count">' + msg.likes + '</span>' +
                    '</div>' +
                    '<span class="msg-date-full">' + msg.date + '</span>' +
                '</div>' +
            '</div>';
        
        grid.appendChild(card);
    });
}

function getInitials(name) {
    var words = name.trim().split(' ');
    if (words.length >= 2) {
        return words[0][0] + words[words.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
}

function getTimeAgo(timestamp) {
    var date = new Date(timestamp);
    var now = new Date();
    var seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'الآن';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' دقيقة';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' ساعة';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' أيام';
    return date.toLocaleDateString('ar-SA');
}

function likeMessage(id, btn) {
    var msg = messages.find(function(m) { return m.id === id; });
    if (msg) {
        msg.liked = !msg.liked;
        msg.likes += msg.liked ? 1 : -1;
        
        var heartIcon = btn.querySelector('.heart-icon');
        var likeText = btn.querySelector('.like-text');
        
        heartIcon.textContent = msg.liked ? '❤️' : '🤍';
        likeText.textContent = msg.liked ? 'معجب' : 'أعجبني';
        
        btn.classList.toggle('liked', msg.liked);
        
        var likesCount = btn.nextElementSibling;
        if (likesCount && likesCount.classList.contains('likes-count')) {
            likesCount.textContent = msg.likes;
        }
        
        saveMessages();
        
        // Show notification
        showNotification(msg.liked ? 'تم الإعجاب بالرسالة! ❤️' : 'تم إلغاء الإعجاب');
    }
}

function saveMessages() {
    localStorage.setItem('anoudMessages', JSON.stringify(messages));
}

function deleteMessage(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    messages = messages.filter(function(m) { return m.id !== id; });
    saveMessages();
    renderMessages();
    showNotification('تم حذف الرسالة بنجاح');
}

// Form submission
var fanForm = document.getElementById('fanForm');
if (fanForm) {
    fanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var name = document.getElementById('fanName').value.trim();
        var message = document.getElementById('fanMessage').value.trim();
        
        if (name && message) {
            var newMessage = {
                id: Date.now(),
                name: name,
                message: message,
                date: new Date().toLocaleDateString('ar-SA'),
                timestamp: new Date().toISOString(),
                likes: 0,
                liked: false
            };
            
            messages.unshift(newMessage);
            saveMessages();
            renderMessages();
            
            this.reset();
            
            // Show success notification
            showNotification('شكراً لك! تم إرسال رسالتك بنجاح! 🎉');
        }
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    initPosts();
    initMessages();
});

// ========================================
// Quiz Game - Anoud Saud Works
// ========================================

// Quiz questions database - 20 accurate questions about Anoud Saud
const quizQuestions = [
    // الجولة 1 - الأسئلة الأساسية
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "مذكرة ابتزاز"؟',
        correct: 'هديل',
        options: ['مريم', 'هديل', 'لميس', 'سارة']
    },
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "بنات الملاكمة"؟',
        correct: 'شمس',
        options: ['شمس', 'لميس', 'هديل', 'سارة']
    },
    {
        type: 'work',
        question: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "أميرة"؟',
        correct: 'ستوديو',
        options: ['ستوديو', 'لعبة كبار', 'عيال نوف', 'حوجن']
    },
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "دكة العبيد"؟',
        correct: 'رحمه',
        options: ['رحمه', 'عبير', 'جمارى', 'مريم']
    },
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "أمي" الذي شاركت فيه العنود سعود؟',
        correct: '2025',
        options: ['2023', '2024', '2025', '2022']
    },
    
    // الجولة 2 - الشخصيات والأدوار
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "كلاود كيتشن"؟',
        correct: 'عبير',
        options: ['عبير', 'رحمه', 'جمارى', 'مريم']
    },
    {
        type: 'work',
        question: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "مرزوقة"؟',
        correct: 'لعبة كبار',
        options: ['ستوديو', 'لعبة كبار', 'عيال نوف', 'مذكرة ابتزاز']
    },
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "عيال نوف"؟',
        correct: 'صمود',
        options: ['صمود', 'لميس', 'خلود', 'ملك']
    },
    {
        type: 'work',
        question: 'ما اسم المسلسل الذي لعبت فيه العنود سعود دور "جمارى"؟',
        correct: 'حوجن',
        options: ['دكة العبيد', 'حوجن', 'كلاود كيتشن', 'أمي']
    },
    {
        type: 'role',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "بعد حين"؟',
        correct: 'خلود',
        options: ['ملك', 'خلود', 'لميس', 'هديل']
    },
    
    // الجولة 3 - السنوات والمسلسلات
    {
        type: 'work',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "كنا امس"؟',
        correct: 'لميس',
        options: ['لميس', 'هديل', 'شمس', 'سارة']
    },
    {
        type: 'work',
        question: 'ما اسم الشخصية التي لعبتها العنود سعود في مسلسل "ضحايا حلال"؟',
        correct: 'ملك',
        options: ['ملك', 'رحمه', 'عبير', 'مريم']
    },
    {
        type: 'work',
        question: 'في أي عام بدأ العنود سعود مسيرتها الفنية؟',
        correct: '2019',
        options: ['2018', '2019', '2020', '2021']
    },
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "بنات الملاكمة"؟',
        correct: '2019-2020',
        options: ['2018-2019', '2019-2020', '2020-2021', '2021-2022']
    },
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "دكة العبيد"؟',
        correct: '2023',
        options: ['2021', '2022', '2023', '2024']
    },
    
    // الجولة 4 - معلومات إضافية
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "ستوديو"؟',
        correct: '2021',
        options: ['2019', '2020', '2021', '2022']
    },
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "عيال نوف"؟',
        correct: '2022',
        options: ['2020', '2021', '2022', '2023']
    },
    {
        type: 'work',
        question: 'في أي عام تم عرض مسلسل "لعبة كبار"؟',
        correct: '2021',
        options: ['2019', '2020', '2021', '2022']
    },
    {
        type: 'work',
        question: 'كم عدد الأعمال التي شاركت فيها العنود سعود في عام 2020؟',
        correct: '4',
        options: ['2', '3', '4', '5']
    },
    {
        type: 'work',
        question: 'كم عدد الأعمال التي شاركت فيها العنود سعود في عام 2023؟',
        correct: '3',
        options: ['1', '2', '3', '4']
    }
];

// Game state
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// Game state
let currentRound = 1;
const totalRounds = 4;
const questionsPerRound = 5;
const totalQuestions = 20;

// Start the game
function startGame() {
    // Reset state
    currentQuestionIndex = 0;
    currentRound = 1;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    // Select 20 random questions (5 rounds × 4 questions)
    currentQuestions = shuffleArray([...quizQuestions]).slice(0, totalQuestions);
    
    // Hide start screen and result screen, show quiz screen
    document.getElementById('gameStart').style.display = 'none';
    document.getElementById('resultScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');
    
    // Show first question
    showQuestion();
}

// Show current question
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // Calculate round and question within round
    const questionInRound = (currentQuestionIndex % questionsPerRound) + 1;
    currentRound = Math.floor(currentQuestionIndex / questionsPerRound) + 1;
    
    // Add entrance animation to quiz screen
    const quizScreen = document.getElementById('quizScreen');
    quizScreen.style.opacity = '0';
    quizScreen.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        quizScreen.style.transition = 'all 0.5s ease-out';
        quizScreen.style.opacity = '1';
        quizScreen.style.transform = 'scale(1)';
    }, 50);
    
    // Update progress with round info
    document.getElementById('questionProgress').textContent = 'الجولة ' + currentRound + ' | السؤال ' + questionInRound + ' من ' + questionsPerRound;
    document.getElementById('currentScore').textContent = 'النتيجة: ' + score;
    document.getElementById('progressFill').style.width = ((currentQuestionIndex / totalQuestions) * 100) + '%';
    
    // Update question with animation
    document.getElementById('questionNumber').textContent = 'السؤال #' + (currentQuestionIndex + 1);
    document.getElementById('questionText').textContent = question.question;
    
    // Animate question elements
    const questionText = document.getElementById('questionText');
    const questionNumber = document.getElementById('questionNumber');
    questionText.style.opacity = '0';
    questionText.style.transform = 'translateY(20px)';
    questionNumber.style.opacity = '0';
    questionNumber.style.transform = 'scale(0.5)';
    
    setTimeout(() => {
        questionText.style.transition = 'all 0.4s ease-out';
        questionText.style.opacity = '1';
        questionText.style.transform = 'translateY(0)';
        questionNumber.style.transition = 'all 0.4s ease-out';
        questionNumber.style.opacity = '1';
        questionNumber.style.transform = 'scale(1)';
    }, 200);
    
    // Shuffle options
    const shuffledOptions = shuffleArray([...question.options]);
    const correctAnswer = question.correct; // Store correct answer
    
    // Generate options HTML with staggered animation
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';
    
    for (var i = 0; i < shuffledOptions.length; i++) {
        var option = shuffledOptions[i];
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        // Add entrance animation with staggered delay
        btn.style.opacity = '0';
        btn.style.transform = 'translateX(-30px)';
        btn.onclick = (function(selected, correctAnswer) {
            return function() {
                checkAnswer(selected, correctAnswer);
            };
        })(option, correctAnswer);
        optionsGrid.appendChild(btn);
        
        // Staggered animation for options
        setTimeout(function(btnElement) {
            return function() {
                btnElement.style.transition = 'all 0.4s ease-out';
                btnElement.style.opacity = '1';
                btnElement.style.transform = 'translateX(0)';
            };
        }(btn), 150 + (i * 100));
    }
    
    // Hide feedback and next button
    document.getElementById('feedbackMessage').classList.remove('show');
    document.getElementById('nextQuestionBtn').classList.remove('show');
}

// Check answer
function checkAnswer(selected, correct) {
    // Disable all options
    const allOptions = document.querySelectorAll('.option-btn');
    
    // Check if already answered
    if (document.querySelector('.option-btn.correct') || document.querySelector('.option-btn.wrong')) {
        return; // Prevent multiple answers
    }
    
    // Highlight selected button
    allOptions.forEach(function(optBtn) {
        optBtn.classList.add('disabled');
        if (optBtn.textContent === selected) {
            optBtn.classList.add(selected === correct ? 'correct' : 'wrong');
        }
        // Highlight correct answer if wrong
        if (selected !== correct && optBtn.textContent === correct) {
            optBtn.classList.add('correct');
        }
    });
    
    // Check answer and update score
    if (selected === correct) {
        score += 20;
        correctAnswers++;
        document.getElementById('feedbackMessage').textContent = '✓ إجابة صحيحة! أحسنت!';
        document.getElementById('feedbackMessage').className = 'feedback show correct';
    } else {
        wrongAnswers++;
        document.getElementById('feedbackMessage').textContent = '✗ إجابة خاطئة! الإجابة الصحيحة: ' + correct;
        document.getElementById('feedbackMessage').className = 'feedback show wrong';
    }
    
    // Update score display
    document.getElementById('currentScore').textContent = 'النتيجة: ' + score;
    
    // Show next button
    document.getElementById('nextQuestionBtn').classList.add('show');
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < totalQuestions) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show results
function showResults() {
    // Add entrance animation to result screen
    const resultScreen = document.getElementById('resultScreen');
    resultScreen.style.opacity = '0';
    resultScreen.style.transform = 'scale(0.8)';
    
    // Hide quiz screen, show result screen
    document.getElementById('quizScreen').classList.remove('active');
    resultScreen.classList.add('active');
    
    setTimeout(() => {
        resultScreen.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        resultScreen.style.opacity = '1';
        resultScreen.style.transform = 'scale(1)';
    }, 50);
    
    // Update progress bar
    document.getElementById('progressFill').style.width = '100%';
    
    // Update final score with animation
    const finalScore = document.getElementById('finalScore');
    const correctAnswersEl = document.getElementById('correctAnswers');
    const wrongAnswersEl = document.getElementById('wrongAnswers');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultStats = document.querySelector('.result-stats');
    const resultActions = document.querySelector('.result-actions');
    
    // Reset and animate elements
    finalScore.style.opacity = '0';
    finalScore.style.transform = 'scale(0.5)';
    correctAnswersEl.style.opacity = '0';
    correctAnswersEl.style.transform = 'scale(0.5)';
    wrongAnswersEl.style.opacity = '0';
    wrongAnswersEl.style.transform = 'scale(0.5)';
    resultEmoji.style.opacity = '0';
    resultEmoji.style.transform = 'scale(0) rotate(-180deg)';
    resultTitle.style.opacity = '0';
    resultTitle.style.transform = 'translateY(20px)';
    resultMessage.style.opacity = '0';
    resultMessage.style.transform = 'translateY(20px)';
    resultStats.style.opacity = '0';
    resultStats.style.transform = 'translateY(30px)';
    resultActions.style.opacity = '0';
    resultActions.style.transform = 'translateY(20px)';
    
    // Update values
    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('wrongAnswers').textContent = wrongAnswers;
    
    // Set emoji based on score
    var emoji = '💪';
    var title = 'حاول مرة أخرى!';
    var message = 'لا بأس! حاول مرة أخرى!';
    
    if (score >= 100) {
        emoji = '🏆';
        title = 'ممتاز!';
        message = 'أحسنت! أنت خبير حقيقي في أعمال العنود سعود!';
    } else if (score >= 80) {
        emoji = '🌟';
        title = 'رائع جداً!';
        message = 'معرفة ممتازة بأعمال العنود سعود!';
    } else if (score >= 60) {
        emoji = '👍';
        title = 'جيد جداً!';
        message = 'أداء جيد! استمر في التعلم عن أعمالها!';
    } else if (score >= 40) {
        emoji = '💪';
        title = 'جيد!';
        message = 'لديك معرفة جيدة. يمكنك تحسينها بالمزيد من المشاهدة!';
    }
    
    resultEmoji.textContent = emoji;
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    
    // Animate elements in sequence
    setTimeout(function() {
        resultEmoji.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        resultEmoji.style.opacity = '1';
        resultEmoji.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
    
    setTimeout(function() {
        resultTitle.style.transition = 'all 0.4s ease-out';
        resultTitle.style.opacity = '1';
        resultTitle.style.transform = 'translateY(0)';
    }, 350);
    
    setTimeout(function() {
        resultMessage.style.transition = 'all 0.4s ease-out';
        resultMessage.style.opacity = '1';
        resultMessage.style.transform = 'translateY(0)';
    }, 450);
    
    setTimeout(function() {
        resultStats.style.transition = 'all 0.5s ease-out';
        resultStats.style.opacity = '1';
        resultStats.style.transform = 'translateY(0)';
        
        // Animate stats values with counting effect
        animateValue(finalScore, 0, score, 1000);
        animateValue(correctAnswersEl, 0, correctAnswers, 1000);
        animateValue(wrongAnswersEl, 0, wrongAnswers, 1000);
    }, 550);
    
    setTimeout(function() {
        resultActions.style.transition = 'all 0.5s ease-out';
        resultActions.style.opacity = '1';
        resultActions.style.transform = 'translateY(0)';
    }, 750);
}

// Animate numeric values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Shuffle array helper
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Scroll to section helper
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}