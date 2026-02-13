let currentUser = null;
let currentDiary = '';

// Load users from memory or start with an empty list
let users = JSON.parse(localStorage.getItem('diary_users')) || [];

function toggleAuth() {
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const toggleLink = document.getElementById('toggle-link');
    
    if (title.innerText === '💖 Barbie Login 💖') {
        title.innerText = '💖 Barbie Sign Up 💖';
        btn.innerText = 'Sign Up';
        toggleLink.innerText = 'Already have an account? Login';
    } else {
        title.innerText = '💖 Barbie Login 💖';
        btn.innerText = 'Login';
        toggleLink.innerText = 'New here? Sign Up';
    }
}

function handleAuth() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    const mode = document.getElementById('auth-btn').innerText;

    if (!userVal || !passVal) return alert("Fill all fields! ✨");

    if (mode === 'Sign Up') {
        if (users.find(u => u.username === userVal)) return alert("User already exists!");
        
        // Create new user object with an empty secret code initially
        users.push({ username: userVal, password: passVal, secretCode: null, data: {} });
        localStorage.setItem('diary_users', JSON.stringify(users));
        alert("Account created! Please Login. ✨");
        toggleAuth();
    } else {
        const user = users.find(u => u.username === userVal && u.password === passVal);
        if (user) {
            currentUser = user;
            showDashboard();
        } else {
            alert("Wrong username or password! 🎀");
        }
    }
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('diary-dashboard').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Welcome, ${currentUser.username}!`;
}

function openDiary(type) {
    currentDiary = type;
    document.getElementById('entry-area').classList.remove('hidden');
    document.getElementById('diary-title').innerText = type.toUpperCase();
    document.getElementById('diary-content').classList.add('hidden');
    document.getElementById('secret-lock').classList.add('hidden');

    if (type === 'secret') {
        // Check if user has ever set a secret code
        if (!currentUser.secretCode) {
            document.getElementById('lock-msg').innerText = "Set your 4-digit Secret Code:";
            document.getElementById('secret-lock').classList.remove('hidden');
        } else {
            document.getElementById('lock-msg').innerText = "Enter Secret Code to Unlock:";
            document.getElementById('secret-lock').classList.remove('hidden');
        }
    } else {
        loadContent();
    }
}

function unlockSecret() {
    const codeInput = document.getElementById('secret-code').value;
    
    if (!currentUser.secretCode) {
        // Setting the code for the first time
        currentUser.secretCode = codeInput;
        saveUserToDB();
        loadContent();
    } else if (codeInput === currentUser.secretCode) {
        loadContent();
    } else {
        alert("Wrong Code! 🤫");
    }
}

function loadContent() {
    document.getElementById('diary-content').classList.remove('hidden');
    document.getElementById('secret-lock').classList.add('hidden');
    document.getElementById('diary-text').value = currentUser.data[currentDiary] || "";
}

function saveEntry() {
    const text = document.getElementById('diary-text').value;
    currentUser.data[currentDiary] = text; // Save to local object
    saveUserToDB(); // Sync with localStorage
    alert("Saved to your Barbie Book! 💖");
}

function saveUserToDB() {
    const index = users.findIndex(u => u.username === currentUser.username);
    users[index] = currentUser;
    localStorage.setItem('diary_users', JSON.stringify(users));
}

function logout() { location.reload(); }

