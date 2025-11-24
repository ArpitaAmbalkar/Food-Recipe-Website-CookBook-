document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-link');
    const recipeGrid = document.getElementById('recipe-grid');
    const recipeDetail = document.getElementById('recipe-detail');
    const recipeForm = document.getElementById('recipe-form');
    const searchInput = document.getElementById('search-input');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const prepTimeFilter = document.getElementById('prep-time-filter');
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const detailBackBtn = document.getElementById('detail-back-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const stepsContainer = document.getElementById('steps-container');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const addStepBtn = document.getElementById('add-step-btn');
    const emptyState = document.getElementById('empty-state');
    const formTitle = document.getElementById('form-title');

    // Application State
    let recipes = [];
    let currentRecipeId = null;
    const STORAGE_KEY = 'recipes';

    // Initialize the application
    function init() {
        loadRecipes();
        renderRecipeGrid();
        setupEventListeners();
    }
    // Simple PDF Download
// Working PDF Download using Print to PDF
function downloadRecipePDF(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // Create a print-friendly version
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${recipe.title} - Simple Recipes</title>
            <style>
                @media print {
                    @page { margin: 1cm; }
                }
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 800px; 
                    margin: 0 auto; 
                    padding: 20px;
                    background: white;
                }
                .header { 
                    text-align: center; 
                    border-bottom: 3px solid #ff6b6b; 
                    padding-bottom: 20px; 
                    margin-bottom: 30px; 
                }
                .title { 
                    font-size: 28px; 
                    margin-bottom: 10px; 
                    color: #333;
                    font-weight: bold;
                }
                .description {
                    color: #666;
                    font-size: 16px;
                    font-style: italic;
                    margin-bottom: 20px;
                }
                .meta-grid { 
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 25px 0;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .meta-item {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                    border-left: 4px solid #ff6b6b;
                }
                .meta-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .meta-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }
                .section { 
                    margin-bottom: 30px; 
                    page-break-inside: avoid;
                }
                .section-title { 
                    border-bottom: 2px solid #ff6b6b; 
                    padding-bottom: 8px; 
                    margin-bottom: 15px; 
                    color: #333;
                    font-size: 20px;
                }
                .ingredients-list { 
                    list-style: none;
                    padding: 0;
                }
                .ingredients-list li { 
                    margin-bottom: 8px; 
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    border-left: 3px solid #4CAF50;
                }
                .steps-list { 
                    list-style: none;
                    padding: 0;
                    counter-reset: step-counter;
                }
                .steps-list li { 
                    margin-bottom: 15px; 
                    padding: 15px;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    position: relative;
                    padding-left: 60px;
                }
                .steps-list li:before {
                    counter-increment: step-counter;
                    content: counter(step-counter);
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #ff6b6b;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                .footer { 
                    margin-top: 50px; 
                    text-align: center; 
                    color: #666; 
                    border-top: 1px solid #ddd; 
                    padding-top: 20px; 
                    font-style: italic;
                    font-size: 14px;
                }
                .app-logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #ff6b6b;
                    margin-bottom: 10px;
                }
                .print-date {
                    color: #999;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="app-logo">🍳 Simple Recipes</div>
                <h1 class="title">${recipe.title}</h1>
                <p class="description">${recipe.description}</p>
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <div class="meta-label">Prep Time</div>
                        <div class="meta-value">${recipe.prepTime} minutes</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Cook Time</div>
                        <div class="meta-value">${recipe.cookTime} minutes</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Total Time</div>
                        <div class="meta-value">${recipe.prepTime + recipe.cookTime} minutes</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Difficulty</div>
                        <div class="meta-value">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">📋 Ingredients</h2>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h2 class="section-title">👨‍🍳 Cooking Instructions</h2>
                <ol class="steps-list">
                    ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="footer">
                <p>Printed from Simple Recipes • Your personal recipe collection</p>
                <p class="print-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p>Happy Cooking! 🎉</p>
            </div>
        </body>
        </html>
    `;

    // Open print dialog for PDF saving
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
        printWindow.print();
    }, 500);
}
    // Load recipes from localStorage
    function loadRecipes() {
        try {
            const storedRecipes = localStorage.getItem(STORAGE_KEY);
            if (storedRecipes) {
                recipes = JSON.parse(storedRecipes);
            } else {
                initializeSampleRecipes();
            }
        } catch (error) {
            console.error('Error loading recipes from localStorage:', error);
            initializeSampleRecipes();
        }
    }

    // Initialize with sample recipes
    function initializeSampleRecipes() {
        recipes = [
            {
                id: generateId(),
                title: "Aalo Paratha",
                description: "Tasty and easy recipe",
                image: "https://www.cookingandme.com/wp-content/uploads/2011/02/5457756163_5051a6c2b5.jpg",
                prepTime: 5,
                cookTime: 15,
                difficulty: "medium",
                ingredients: [
                    "2 bowl wheat flour",
                    "Salt 1/2 tea spoon",
                    "Oil 1 table spoon",
                    "Water 200 ml",
                    "3 Medium size Potato",
                    "Chopped onion half bowl",
                    "Ghee"
                ],
                steps: [
                    "Boil the potatoes until soft.",
                    "Peel and mash the potatoes.",
                    "Mix mashed potatoes with spices like salt, red chilli powder, garam masala, and coriander.",
                    "Knead wheat flour dough with water and a little oil.",
                    "Take a small ball of dough and roll it slightly.",
                    "Place the potato stuffing in the center.",
                    "Seal the edges and flatten gently.",
                    "Roll the stuffed dough carefully into a paratha.",
                    "Heat a tawa on medium flame.",
                    "Cook the paratha on both sides with ghee or oil until golden brown."
                ]
            },
            {
                id: generateId(),
                title: "My Signature Pasta",
                description: "A delicious and easy-to-make pasta dish that's perfect for weeknight dinners.",
                image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                prepTime: 15,
                cookTime: 20,
                difficulty: "easy",
                ingredients: [
                    "8 oz pasta",
                    "2 tbsp olive oil",
                    "3 cloves garlic, minced",
                    "1 cup cherry tomatoes, halved",
                    "1/4 cup fresh basil, chopped",
                    "Salt and pepper to taste",
                    "Parmesan cheese for serving"
                ],
                steps: [
                    "Cook pasta according to package instructions until al dente.",
                    "While pasta is cooking, heat olive oil in a large pan over medium heat.",
                    "Add garlic and sauté until fragrant, about 1 minute.",
                    "Add cherry tomatoes and cook until they start to soften, about 5 minutes.",
                    "Drain pasta, reserving 1/4 cup of pasta water.",
                    "Add pasta to the pan with tomatoes and garlic.",
                    "Toss to combine, adding pasta water if needed to create a light sauce.",
                    "Stir in fresh basil and season with salt and pepper.",
                    "Serve immediately with grated Parmesan cheese."
                ]
            },
            {
                id: generateId(),
                title: "Classic Chocolate Chip Cookies",
                description: "Soft and chewy chocolate chip cookies that are always a crowd-pleaser.",
                image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                prepTime: 15,
                cookTime: 10,
                difficulty: "easy",
                ingredients: [
                    "2 1/4 cups all-purpose flour",
                    "1 tsp baking soda",
                    "1 tsp salt",
                    "1 cup butter, softened",
                    "3/4 cup granulated sugar",
                    "3/4 cup packed brown sugar",
                    "2 large eggs",
                    "2 tsp vanilla extract",
                    "2 cups chocolate chips"
                ],
                steps: [
                    "Preheat oven to 375°F (190°C).",
                    "In a small bowl, mix flour, baking soda, and salt.",
                    "In a large bowl, beat butter, granulated sugar, and brown sugar until creamy.",
                    "Add eggs one at a time, then add vanilla, beating well after each addition.",
                    "Gradually beat in flour mixture.",
                    "Stir in chocolate chips.",
                    "Drop by rounded tablespoon onto ungreased baking sheets.",
                    "Bake for 9-11 minutes or until golden brown.",
                    "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely."
                ]
            },
            {
                id: generateId(),
                title: "Masala Chai",
                description: "Aromatic and flavorful Indian spiced tea that warms the soul. Perfect for chilly mornings or as an evening refreshment.",
                image: "https://cdn.create.vista.com/api/media/small/408197700/stock-photo-indian-popular-drink-masala-chai-masala-tea-traditional-beverage-black",
                prepTime: 5,
                cookTime: 10,
                difficulty: "easy",
                ingredients: [
                    "2 cups water",
                    "1 cup milk",
                    "2 teaspoons black tea leaves or 2 tea bags",
                    "2-3 teaspoons sugar (adjust to taste)",
                    "1 inch ginger, crushed or sliced",
                    "2-3 green cardamom pods, crushed",
                    "1 small cinnamon stick",
                    "2-3 cloves",
                    "1-2 black peppercorns (optional)",
                    "1 star anise (optional)",
                    "A pinch of nutmeg (optional)"
                ],
                steps: [
                    "Crush the ginger, cardamom pods, cinnamon, cloves, and peppercorns lightly using a mortar and pestle to release their flavors.",
                    "In a saucepan, add water and all the crushed spices. Bring to a boil.",
                    "Reduce heat and let the spices simmer for 3-4 minutes to infuse the water with their flavors.",
                    "Add tea leaves or tea bags to the spiced water and simmer for another 2 minutes.",
                    "Pour in the milk and add sugar according to your taste preference.",
                    "Bring the mixture to a boil again, then reduce heat and simmer for 2-3 minutes until the tea becomes rich in color.",
                    "Strain the masala chai into cups using a fine strainer.",
                    "Serve hot and enjoy the aromatic flavors of traditional Indian masala chai!"
                ]
            },
            {
                id: generateId(),
                title: "Besan Chilla with Dahi Chatni",
                description: "Savory gram flour pancakes served with spiced tempered yogurt - a complete and nutritious meal that's both delicious and healthy.",
                image: "https://preview.redd.it/can-i-have-paneer-besan-cheela-with-dahi-on-daily-basis-v0-80e7j81nwn1e1.jpeg?width=640&crop=smart&auto=webp&s=04b9d8a471d4dbc5f2271d9cb9a8a656150c1c80",
                prepTime: 15,
                cookTime: 20,
                difficulty: "medium",
                ingredients: [
                    "For Besan Chilla:",
                    "1 cup besan (gram flour)",
                    "1 medium onion, finely chopped",
                    "1 medium tomato, finely chopped",
                    "1 green chili, finely chopped",
                    "2 tablespoons coriander leaves, finely chopped",
                    "1/2 teaspoon cumin seeds",
                    "1/4 teaspoon turmeric powder",
                    "1/2 teaspoon red chili powder",
                    "1/2 teaspoon garam masala",
                    "Salt to taste",
                    "3/4 cup water (adjust for consistency)",
                    "Oil for cooking",
                    
                    "For Tadka Dahi:",
                    "2 cups fresh curd (yogurt)",
                    "1 tablespoon oil",
                    "1/2 teaspoon mustard seeds",
                    "1/2 teaspoon cumin seeds",
                    "2-3 dry red chilies",
                    "8-10 curry leaves",
                    "A pinch of asafoetida (hing)",
                    "1/2 teaspoon red chili powder",
                    "Salt to taste",
                    "1 tablespoon coriander leaves for garnish"
                ],
                steps: [
                    "For Besan Chilla Batter:",
                    "In a large mixing bowl, take besan (gram flour) and add all dry spices - turmeric powder, red chili powder, garam masala, and salt.",
                    "Add cumin seeds, chopped onions, tomatoes, green chili, and coriander leaves to the bowl.",
                    "Gradually add water while whisking to make a smooth, lump-free batter. The consistency should be similar to pancake batter.",
                    "Let the batter rest for 10-15 minutes while you prepare the tadka dahi.",
                    
                    "For Tadka Dahi:",
                    "Whisk the curd until smooth in a serving bowl. Add salt and mix well.",
                    "Heat oil in a small tempering pan. Add mustard seeds and let them splutter.",
                    "Add cumin seeds, dry red chilies, curry leaves, and asafoetida. Fry for 30 seconds until fragrant.",
                    "Add red chili powder and immediately pour this hot tempering over the whisked curd.",
                    "Garnish with coriander leaves and set aside.",
                    
                    "Cooking Besan Chilla:",
                    "Heat a non-stick tawa or griddle over medium heat. Grease lightly with oil.",
                    "Pour a ladleful of batter onto the hot tawa and spread it gently in circular motion to form a thin pancake.",
                    "Drizzle a few drops of oil around the edges and cook on medium flame for 2-3 minutes.",
                    "When the edges start lifting and the bottom turns golden brown, flip the chilla carefully.",
                    "Cook the other side for 1-2 minutes until golden spots appear.",
                    "Repeat with remaining batter to make more chillas.",
                    
                    "Serving:",
                    "Serve hot besan chillas immediately with the prepared tadka dahi on the side.",
                    "You can also drizzle some green chutney or tomato ketchup for extra flavor.",
                    "Enjoy this protein-packed, wholesome meal!"
                ]
            }
        ];
        saveRecipes();
    }

    // Save recipes to localStorage
    function saveRecipes() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        } catch (error) {
            console.error('Error saving recipes to localStorage:', error);
            alert('Error saving recipe. Please try again.');
        }
    }

    // Generate a unique ID for recipes
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Set up event listeners
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const view = this.getAttribute('data-view');
                showView(view);
            });
        });

        // Recipe actions
        addRecipeBtn.addEventListener('click', () => showAddForm());
        detailBackBtn.addEventListener('click', () => showView('home'));
        cancelBtn.addEventListener('click', () => showView('home'));

        // Search and filter
        searchInput.addEventListener('input', renderRecipeGrid);
        difficultyFilter.addEventListener('change', renderRecipeGrid);
        prepTimeFilter.addEventListener('change', renderRecipeGrid);

        // Form actions
        recipeForm.addEventListener('submit', handleFormSubmit);
        addIngredientBtn.addEventListener('click', () => addIngredientField());
        addStepBtn.addEventListener('click', () => addStepField());

        // Dynamic removal of ingredient/step fields
        ingredientsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-btn')) {
                if (ingredientsContainer.children.length > 1) {
                    e.target.parentElement.remove();
                }
            }
        });

        stepsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-btn')) {
                if (stepsContainer.children.length > 1) {
                    e.target.parentElement.remove();
                }
            }
        });
    }

    // Show specific view
    function showView(viewName) {
        // Update navigation
        navLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Show selected view
        views.forEach(view => {
            if (view.id === `${viewName}-view`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Refresh recipe grid when showing home view
        if (viewName === 'home') {
            renderRecipeGrid();
        }
    }

    // Show add recipe form
    function showAddForm() {
        currentRecipeId = null;
        formTitle.textContent = 'Add New Recipe';
        recipeForm.reset();
        
        // Reset dynamic fields to one each
        while (ingredientsContainer.children.length > 1) {
            ingredientsContainer.removeChild(ingredientsContainer.lastChild);
        }
        while (stepsContainer.children.length > 1) {
            stepsContainer.removeChild(stepsContainer.lastChild);
        }
        
        // Clear any existing error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        showView('form');
    }

    // Show edit recipe form
    function showEditForm(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        currentRecipeId = recipeId;
        formTitle.textContent = 'Edit Recipe';
        
        // Populate form fields
        document.getElementById('recipe-title').value = recipe.title;
        document.getElementById('recipe-description').value = recipe.description || '';
        document.getElementById('recipe-image').value = recipe.image || '';
        document.getElementById('prep-time').value = recipe.prepTime;
        document.getElementById('cook-time').value = recipe.cookTime;
        document.getElementById('recipe-difficulty').value = recipe.difficulty;
        
        // Populate ingredients
        ingredientsContainer.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            addIngredientField(ingredient);
        });
        
        // Populate steps
        stepsContainer.innerHTML = '';
        recipe.steps.forEach(step => {
            addStepField(step);
        });
        
        // Clear any existing error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        showView('form');
    }

    // Add ingredient field
    function addIngredientField(value = '') {
        const div = document.createElement('div');
        div.className = 'ingredient-item';
        div.innerHTML = `
            <input type="text" class="ingredient-input" placeholder="Ingredient" value="${value}" required>
            <button type="button" class="remove-btn">×</button>
        `;
        ingredientsContainer.appendChild(div);
    }

    // Add step field
    function addStepField(value = '') {
        const div = document.createElement('div');
        div.className = 'step-item';
        div.innerHTML = `
            <input type="text" class="step-input" placeholder="Step description" value="${value}" required>
            <button type="button" class="remove-btn">×</button>
        `;
        stepsContainer.appendChild(div);
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = {
            id: currentRecipeId || generateId(),
            title: document.getElementById('recipe-title').value.trim(),
            description: document.getElementById('recipe-description').value.trim(),
            image: document.getElementById('recipe-image').value.trim(),
            prepTime: parseInt(document.getElementById('prep-time').value),
            cookTime: parseInt(document.getElementById('cook-time').value),
            difficulty: document.getElementById('recipe-difficulty').value,
            ingredients: Array.from(document.querySelectorAll('.ingredient-input'))
                .map(input => input.value.trim())
                .filter(value => value !== ''),
            steps: Array.from(document.querySelectorAll('.step-input'))
                .map(input => input.value.trim())
                .filter(value => value !== '')
        };
        
        // Update or add recipe
        if (currentRecipeId) {
            // Update existing recipe
            const index = recipes.findIndex(r => r.id === currentRecipeId);
            if (index !== -1) {
                recipes[index] = formData;
            }
        } else {
            // Add new recipe
            recipes.push(formData);
        }
        
        // Save and update UI
        saveRecipes();
        showView('home');
        renderRecipeGrid();
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        // Validate title
        const title = document.getElementById('recipe-title').value.trim();
        if (!title) {
            document.getElementById('title-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate prep time
        const prepTime = document.getElementById('prep-time').value;
        if (!prepTime || parseInt(prepTime) < 1) {
            document.getElementById('prep-time-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate cook time
        const cookTime = document.getElementById('cook-time').value;
        if (!cookTime || parseInt(cookTime) < 1) {
            document.getElementById('cook-time-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate difficulty
        const difficulty = document.getElementById('recipe-difficulty').value;
        if (!difficulty) {
            document.getElementById('difficulty-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate ingredients
        const ingredients = Array.from(document.querySelectorAll('.ingredient-input'))
            .map(input => input.value.trim())
            .filter(value => value !== '');
        
        if (ingredients.length === 0) {
            document.getElementById('ingredients-error').style.display = 'block';
            isValid = false;
        }
        
        // Validate steps
        const steps = Array.from(document.querySelectorAll('.step-input'))
            .map(input => input.value.trim())
            .filter(value => value !== '');
        
        if (steps.length === 0) {
            document.getElementById('steps-error').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }

    // Render recipe grid
    // Render recipe grid
function renderRecipeGrid() {
    const searchTerm = searchInput.value.toLowerCase();
    const difficultyFilterValue = difficultyFilter.value;
    const prepTimeFilterValue = parseInt(prepTimeFilter.value);
    
    // Filter recipes
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) || 
                             recipe.description.toLowerCase().includes(searchTerm);
        const matchesDifficulty = difficultyFilterValue === 'all' || 
                                 recipe.difficulty === difficultyFilterValue;
        const matchesPrepTime = prepTimeFilterValue === 0 || 
                               recipe.prepTime <= prepTimeFilterValue;
        
        return matchesSearch && matchesDifficulty && matchesPrepTime;
    });
    
    // Update empty state
    if (filteredRecipes.length === 0) {
        emptyState.style.display = 'block';
        recipeGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        recipeGrid.style.display = 'grid';
    }
    
    // Render recipe cards
    recipeGrid.innerHTML = '';
    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-image-container">
                <img src="${recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" 
                     alt="${recipe.title}" class="recipe-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'">
                <button class="favorite-btn ${isFavorite(recipe.id) ? 'active' : ''}" 
                        data-recipe-id="${recipe.id}">
                    <span class="heart-icon">${isFavorite(recipe.id) ? '♥' : '♡'}</span>
                </button>
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>${recipe.prepTime + recipe.cookTime} min</span>
                    <span class="recipe-difficulty difficulty-${recipe.difficulty}">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</span>
                </div>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-actions">
                    <button class="btn btn-view" data-id="${recipe.id}">View</button>
                    <button class="btn btn-edit" data-id="${recipe.id}">Edit</button>
                    <button class="btn btn-delete" data-id="${recipe.id}">Delete</button>
                </div>
            </div>
        `;
        recipeGrid.appendChild(card);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            showRecipeDetail(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            showEditForm(this.getAttribute('data-id'));
        });
    });
      
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteRecipe(this.getAttribute('data-id'));
        });
    });
    
    // Add event listener for favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-recipe-id');
            const isNowFavorite = toggleFavorite(recipeId);
            
            this.classList.toggle('active', isNowFavorite);
            this.querySelector('.heart-icon').textContent = isNowFavorite ? '♥' : '♡';
        });
    });
}

    // Show recipe detail
    function showRecipeDetail(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        recipeDetail.innerHTML = `
            <div class="recipe-header">
                <img src="${recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" 
                     alt="${recipe.title}" class="recipe-image-large" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'">
                <div class="recipe-info">
                    <h1>${recipe.title}</h1>
                    <p>${recipe.description}</p>
                    <div class="recipe-stats">
                        <div class="stat">
                            <span class="stat-value">${recipe.prepTime}</span>
                            <span class="stat-label">Prep (min)</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${recipe.cookTime}</span>
                            <span class="stat-label">Cook (min)</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${recipe.prepTime + recipe.cookTime}</span>
                            <span class="stat-label">Total (min)</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value difficulty-${recipe.difficulty}">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</span>
                            <span class="stat-label">Difficulty</span>
                        </div>
                    </div>
                    <div class="recipe-actions">
                        <button class="btn btn-edit" id="detail-edit-btn" data-id="${recipe.id}">Edit</button>
                        <button class="btn btn-delete" id="detail-delete-btn" data-id="${recipe.id}">Delete</button>
                        <button class="btn btn-pdf" id="detail-pdf-btn" data-id="${recipe.id}">📥 Export PDF</button>
                    </div>
                </div>
            </div>
            <div class="recipe-body">
                <div class="ingredients-list">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
                <div class="steps-list">
                    <h3>Steps</h3>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;
        
        // Add event listeners to action buttons in detail view
        document.getElementById('detail-edit-btn').addEventListener('click', function() {
            showEditForm(this.getAttribute('data-id'));
        });
        
        document.getElementById('detail-delete-btn').addEventListener('click', function() {
            deleteRecipe(this.getAttribute('data-id'));
        });
        // Add this with your other event listeners in showRecipeDetail():
document.getElementById('detail-pdf-btn').addEventListener('click', function() {
    downloadRecipePDF(this.getAttribute('data-id'));
});
        
        showView('detail');
    }

    // Delete recipe
    function deleteRecipe(recipeId) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            recipes = recipes.filter(recipe => recipe.id !== recipeId);
            saveRecipes();
            renderRecipeGrid();
            
            // If we're on the detail view, go back to home
            if (document.getElementById('detail-view').classList.contains('active')) {
                showView('home');
            }
        }
    }

    //add
    // Favorite system functions
function initializeFavorites() {
    return JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
}

function toggleFavorite(recipeId) {
    const favorites = initializeFavorites();
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeId);
    }
    
    saveFavorites(favorites);
    return !(index > -1);
}

function isFavorite(recipeId) {
    const favorites = initializeFavorites();
    return favorites.includes(recipeId);
}
    // Initialize the application
    init();
});








/*EXTRA*/
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Apply saved theme on load
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

/*EXTRA 2*/

// Minimal music player
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('music-toggle');
    let music = null;
    let playing = false;
    
    musicToggle.addEventListener('click', function() {
        if (!music) {
            // Create audio on first click (user interaction required)
            music = new Audio('cooking-time-happy-cooking-food-music-336562.mp3');
            music.loop = true;
            music.volume = 0.3;
        }
        
        if (playing) {
            music.pause();
            this.classList.remove('playing');
            this.textContent = '🎵';
            playing = false;
        } else {
            music.play();
            this.classList.add('playing');
            this.textContent = '🎶';
            playing = true;
        }
    });
});


