# 🔍 Where is User Data Stored?

## 📍 Location: Browser's LocalStorage

All user data is stored in your browser's **localStorage**. This is a browser storage mechanism that persists data even after you close the browser.

## 🔑 Storage Keys

The application uses the following localStorage keys:

1. **`users`** - Contains all registered users (including passwords)
2. **`authUser`** - Contains the currently logged-in user (without password)
3. **`tickets`** - Contains all flight tickets
4. **`bookings`** - Contains all bookings

## 🛠️ How to Access Your Data

### Method 1: Using Browser Developer Tools (Easiest)

1. **Open Developer Tools:**
   - Press `F12` on your keyboard, OR
   - Right-click on the page → Select "Inspect" or "Inspect Element"

2. **Navigate to Application/Storage Tab:**
   - **Chrome/Edge:** Click on the **"Application"** tab
   - **Firefox:** Click on the **"Storage"** tab
   - **Safari:** Click on the **"Storage"** tab (enable Developer menu first)

3. **View LocalStorage:**
   - In the left sidebar, expand **"Local Storage"**
   - Click on your website URL (e.g., `http://localhost:5173`)
   - You'll see all the keys on the right side

4. **View Users Data:**
   - Click on the **"users"** key
   - You'll see a JSON string containing all registered users
   - Double-click to edit (be careful!)

### Method 2: Using Browser Console (Quick Check)

1. Open Developer Tools (F12)
2. Go to the **"Console"** tab
3. Type this command and press Enter:

```javascript
JSON.parse(localStorage.getItem('users'))
```

This will show you all registered users in a readable format.

### Method 3: Using the Debug Page (Built-in)

1. Login to your account
2. Navigate to **"Debug Users"** in the navigation menu
3. You'll see all users with their passwords
4. You can reset passwords or delete users from here

## 🔐 How to Check/Reset Your Password

### Option 1: Use the Debug Page (Recommended)

1. Login to any account (or register a new one)
2. Go to **"Debug Users"** page
3. Find your email in the list
4. Click **"Show Passwords"** button
5. You'll see your current password
6. Click **"Reset Password"** to change it

### Option 2: Check via Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Run this command to see all users:

```javascript
const users = JSON.parse(localStorage.getItem('users') || '[]');
users.forEach(user => {
  console.log(`Email: ${user.email}, Password: ${user.password}`);
});
```

### Option 3: Reset Password via Console

If you want to reset your password directly:

```javascript
// Replace 'your-email@example.com' with your actual email
// Replace 'newpassword123' with your desired new password

const users = JSON.parse(localStorage.getItem('users') || '[]');
const emailToUpdate = 'your-email@example.com';
const newPassword = 'newpassword123';

const updatedUsers = users.map(user => {
  if (user.email.toLowerCase() === emailToUpdate.toLowerCase()) {
    return { ...user, password: newPassword };
  }
  return user;
});

localStorage.setItem('users', JSON.stringify(updatedUsers));
console.log('Password updated!');
```

Then refresh the page and try logging in with the new password.

## 🗑️ How to Clear All Data

### Option 1: Using Debug Page
1. Go to **"Debug Users"** page
2. Click **"Clear All Data"** button
3. Confirm the action

### Option 2: Using Browser Console
```javascript
localStorage.clear();
location.reload();
```

### Option 3: Using Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Right-click on your website URL under Local Storage
4. Select "Clear"
5. Refresh the page

## 📝 Important Notes

1. **Data is Browser-Specific:** Data stored in Chrome won't be available in Firefox, and vice versa.

2. **Data Persists:** Data remains even after closing the browser, but can be cleared manually.

3. **Security Warning:** Passwords are stored in plain text (this is for development only). Never use this in production!

4. **Case-Insensitive Emails:** The system stores emails in lowercase. When logging in, make sure to use the correct password.

5. **Password Trimming:** Passwords are automatically trimmed (leading/trailing spaces removed) when stored and compared.

## 🐛 Troubleshooting Login Issues

If you can't login, try these steps:

1. **Check if user exists:**
   ```javascript
   const users = JSON.parse(localStorage.getItem('users') || '[]');
   console.log('Registered users:', users.map(u => u.email));
   ```

2. **Check your password:**
   - Use the Debug Users page to see your actual stored password
   - Make sure you're typing it correctly (check for typos, caps lock, etc.)

3. **Try resetting password:**
   - Use the Debug Users page to reset your password
   - Or use the console method above

4. **Clear and re-register:**
   - Clear all data
   - Register a new account
   - Make sure to remember your password this time!

## 💡 Quick Tips

- **Always use the Debug Users page** to check your password if you forget it
- **Keep a note** of your password during development
- **Use simple passwords** for testing (e.g., "password123")
- **Check browser console** for error messages when login fails

## 🚀 Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify your email is in the users list
3. Make sure password matches exactly (case-sensitive)
4. Try clearing data and registering again

---

**Remember:** This is a development application. In production, passwords should NEVER be stored in plain text and should be hashed using secure methods!

