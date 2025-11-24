# Recipe Manager Web App - README

# How to Run the App

# Quick Start (No Installation Required)
1. Download all files into the same folder:
   - `index.html`
   - `style.css` 
   - `script.js`
   - `yummy-bg-less.webp` (background image)
   - ‘audio file’ 
   - `app_logo.png` (optional logo)

2. Open the application:
   - Double-click `index.html` file, OR
   - Right-click → "Open with" → Your web browser
   - The app will open directly in your browser

3. Start using:
   - Browse existing recipes
   - Add new recipes using the form
   - Search and filter recipes
   - All data saves automatically

# Browser Requirements
- Supported Browsers: Chrome, Firefox, Safari, Edge (latest versions)
- Required: JavaScript must be enabled
- Storage: LocalStorage must be available

##  Data Structure in localStorage

The app stores all data under the key `"recipes"` in your browser's localStorage.

# Recipe Object Structure:
```javascript
{
  "id": "kf9j2h8d7s6",              // Unique identifier
  "title": "Aloo Paratha",          // Recipe name
  "description": "Delicious Indian flatbread...", // Short description
  "image": "https://example.com/image.jpg", // Optional image URL
  "prepTime": 20,                   // Preparation time in minutes
  "cookTime": 25,                   // Cooking time in minutes
  "difficulty": "medium",           // easy/medium/hard
  "ingredients": [                  // Array of ingredients
    "2 cups whole wheat flour",
    "3 medium potatoes",
    "1 teaspoon salt"
  ],
  "steps": [                        // Array of cooking steps
    "Prepare the dough...",
    "Make potato stuffing...",
    "Cook on tawa..."
  ]
}
```

# ⚙️ Technical Implementation

# Storage Location:
- Browser: Chrome → DevTools → Application → Local Storage
- Data: Persists until browser data is cleared
- Format: JSON string converted to/from JavaScript objects

# CRUD Operations:
- Create: `recipes.push(newRecipe)` + `saveRecipes()`
- Read: `loadRecipes()` on app start
- Update: Find recipe by ID and replace
- Delete: Filter out recipe by ID

## 🎯 Assumptions & Limitations

# Assumptions Made:
1. Single User: App designed for personal use on one device
2. Modern Browser: Requires ES6+ JavaScript support
3. Image URLs: Recipes use external image links (no file upload)
4. English Content: All text content is in English
5. Time Format: All times are in minutes

# Technical Limitations:
1. No Cloud Storage: Data stays on your current device/browser
2. No User Accounts: Cannot sync between devices or browsers
3. No Image Upload: Only image URLs supported
4. Storage Limit: Limited by browser's localStorage (typically 5-10MB)
5. No Categories: Basic filtering only (difficulty, prep time)
6. No Backup: Clearing browser data loses all recipes

# Design Limitations:
1. Mobile First: Optimized for mobile, desktop experience is good but not perfect
2. No Print Support: Recipes cannot be printed directly
3. No Sharing: Cannot export or share recipes
4. No Ratings: No user rating system

## 🐛 Known Issues

# Functional Issues:
1. Large Collections: Performance may slow with 100+ recipes
   - *Workaround*: Search/filter helps manage large collections
2. Special Characters: Some special characters in recipes may display incorrectly

# Browser-Specific Issues:
1. Safari: Minor CSS animation differences
2. Mobile Browsers: Touch interactions may feel slightly different
3. Old Browsers: Not compatible with Internet Explorer

# Data Issues:
1. No Data Export: Cannot download recipe data as file
2. No Import: Cannot bulk import recipes
3. Data Recovery: No backup if localStorage gets corrupted

# UI/UX Issues:
1. Form Validation: Error messages could be more descriptive
2. Loading States: No visual loading indicators for large operations
3. Empty States: Basic "no results" message without suggestions




🏅 Extra Features Implemented (Beyond Requirements)
Feature	Benefit
PDF Download using Print API	Quick printable recipe report
Prep Time filter	More advanced filtering


## 📄 License & Credits

Technology: Pure HTML, CSS, JavaScript (No frameworks)  
Icons: SVG-based favicon  
Images: Unsplash and other free sources  
Fonts: Google Fonts (Poppins)

---

Note: This is a frontend-only application. All data persists in your browser's localStorage and will be lost if you clear browser data or switch devices.


