// ========================================
// Firebase Configuration - Anoud Saud Website
// ========================================

// Firebase configuration - Replace with your own config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;
let postsCollection;
let messagesCollection;

// Check if Firebase is available
function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            postsCollection = db.collection('posts');
            messagesCollection = db.collection('messages');
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return false;
        }
    }
    return false;
}

// ========================================
// Posts Functions with Firebase
// ========================================

// Save post to Firebase
async function savePostToFirebase(post) {
    if (!db) return false;
    
    try {
        await postsCollection.doc(post.id.toString()).set({
            id: post.id,
            type: post.type,
            content: post.content,
            date: post.date,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: post.likes || 0,
            likedBy: post.likedBy || []
        });
        return true;
    } catch (error) {
        console.error('Error saving post:', error);
        return false;
    }
}

// Get all posts from Firebase
async function getPostsFromFirebase() {
    if (!db) return null;
    
    try {
        const snapshot = await postsCollection.orderBy('timestamp', 'desc').get();
        const posts = [];
        snapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        return null;
    }
}

// Delete post from Firebase
async function deletePostFromFirebase(postId) {
    if (!db) return false;
    
    try {
        await postsCollection.doc(postId.toString()).delete();
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
}

// Like/unlike post
async function togglePostLike(postId, userId) {
    if (!db) return false;
    
    try {
        const postRef = postsCollection.doc(postId.toString());
        const postDoc = await postRef.get();
        
        if (postDoc.exists) {
            const postData = postDoc.data();
            let likedBy = postData.likedBy || [];
            
            if (likedBy.includes(userId)) {
                likedBy = likedBy.filter(id => id !== userId);
            } else {
                likedBy.push(userId);
            }
            
            await postRef.update({
                likes: likedBy.length,
                likedBy: likedBy
            });
            
            return { success: true, likes: likedBy.length, liked: likedBy.includes(userId) };
        }
        return false;
    } catch (error) {
        console.error('Error toggling like:', error);
        return false;
    }
}

// ========================================
// Messages Functions with Firebase
// ========================================

// Save message to Firebase
async function saveMessageToFirebase(message) {
    if (!db) return false;
    
    try {
        await messagesCollection.doc(message.id.toString()).set({
            id: message.id,
            name: message.name,
            message: message.message,
            date: message.date,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: message.likes || 0,
            likedBy: message.likedBy || []
        });
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
}

// Get all messages from Firebase
async function getMessagesFromFirebase() {
    if (!db) return null;
    
    try {
        const snapshot = await messagesCollection.orderBy('timestamp', 'desc').get();
        const messages = [];
        snapshot.forEach(doc => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        return messages;
    } catch (error) {
        console.error('Error getting messages:', error);
        return null;
    }
}

// Delete message from Firebase
async function deleteMessageFromFirebase(messageId) {
    if (!db) return false;
    
    try {
        await messagesCollection.doc(messageId.toString()).delete();
        return true;
    } catch (error) {
        console.error('Error deleting message:', error);
        return false;
    }
}

// Like/unlike message
async function toggleMessageLike(messageId, userId) {
    if (!db) return false;
    
    try {
        const messageRef = messagesCollection.doc(messageId.toString());
        const messageDoc = await messageRef.get();
        
        if (messageDoc.exists) {
            const messageData = messageDoc.data();
            let likedBy = messageData.likedBy || [];
            
            if (likedBy.includes(userId)) {
                likedBy = likedBy.filter(id => id !== userId);
            } else {
                likedBy.push(userId);
            }
            
            await messageRef.update({
                likes: likedBy.length,
                likedBy: likedBy
            });
            
            return { success: true, likes: likedBy.length, liked: likedBy.includes(userId) };
        }
        return false;
    } catch (error) {
        console.error('Error toggling like:', error);
        return false;
    }
}

// ========================================
// Sync localStorage with Firebase
// ========================================

async function syncData() {
    // Try to load from Firebase first
    const firebasePosts = await getPostsFromFirebase();
    const firebaseMessages = await getMessagesFromFirebase();
    
    if (firebasePosts !== null) {
        posts = firebasePosts;
        localStorage.setItem('anoudPosts', JSON.stringify(posts));
    }
    
    if (firebaseMessages !== null) {
        messages = firebaseMessages;
        localStorage.setItem('anoudMessages', JSON.stringify(messages));
    }
}

// Generate unique user ID
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

