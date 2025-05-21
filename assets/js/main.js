// Notes Data
const notes = [
    {
        id: 1,
        title: "Class 12 Mathematics Notes",
        subject: "math",
        pages: 120,
        price: 199,
        image: "assets/images/math-notes.jpg",
        file: "assets/downloads/math-notes.pdf",
        topics: ["Calculus", "Algebra", "Trigonometry"],
        featured: true
    },
    {
        id: 2,
        title: "NEET Physics Notes",
        subject: "physics",
        pages: 85,
        price: 179,
        image: "assets/images/physics-notes.jpg",
        file: "assets/downloads/physics-notes.pdf",
        topics: ["Mechanics", "Optics", "Electromagnetism"],
        featured: true
    },
    {
        id: 3,
        title: "Class 11 Chemistry Notes",
        subject: "chemistry",
        pages: 95,
        price: 169,
        image: "assets/images/chemistry-notes.jpg",
        file: "assets/downloads/chemistry-notes.pdf",
        topics: ["Organic", "Inorganic", "Physical"],
        featured: true
    },
    {
        id: 4,
        title: "Class 12 Biology Notes",
        subject: "biology",
        pages: 110,
        price: 200,
        image: "assets/images/chemistry-notes.jpg",
        file: "assets/downloads/chemistry-notes.pdf",
        topics: ["Organic", "Inorganic", "Physical"],
        featured: true
    },
    {
        id: 5,
        title: "Advanced Calculus Notes",
        subject: "math",
        pages: 65,
        price: 149,
        image: "assets/images/math-notes-2.jpg",
        file: "assets/downloads/advanced-calculus.pdf",
        topics: ["Integration", "Differentiation", "Series"]
    },
    {
        id: 6,
        title: "Modern Physics Notes",
        subject: "physics",
        pages: 75,
        price: 159,
        image: "assets/images/physics-notes-2.jpg",
        file: "assets/downloads/modern-physics.pdf",
        topics: ["Relativity", "Quantum Mechanics"]
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize dark mode
    initDarkMode();

    // Load featured notes on homepage
    if (document.getElementById('featured-notes')) {
        const featuredNotes = notes.filter(note => note.featured);
        renderNotes(featuredNotes, 'featured-notes');
    }

    // Load all notes on notes page
    if (document.getElementById('all-notes')) {
        renderNotes(notes, 'all-notes');
        setupFilters();
    }

    // Set up category buttons
    setupCategoryButtons();

    // Set up global search
    setupGlobalSearch();

    // Set up success page downloads
    setupSuccessPage();
});

// Initialize dark mode
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStyle = document.getElementById('dark-mode-style');

    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeStyle.disabled = false;
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', function () {
        darkModeStyle.disabled = !darkModeStyle.disabled;
        localStorage.setItem('darkMode', !darkModeStyle.disabled);
        darkModeToggle.innerHTML = darkModeStyle.disabled ?
            '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
}

// Render notes to the page
function renderNotes(notesToRender, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = notesToRender.map(note => `
    <div class="note-card" data-id="${note.id}" data-subject="${note.subject}">
        <img src="${note.image}" alt="${note.title}" class="note-image">
        <div class="note-details">
            <h3 class="note-title">${note.title}</h3>
            <span class="note-subject">${getSubjectName(note.subject)}</span>
            <p class="note-pages"><i class="fas fa-file-alt"></i> ${note.pages} pages</p>
            <p class="note-price">₹${note.price}</p>
            <div class="note-actions">
                <button class="add-to-cart" data-id="${note.id}">Add to Cart</button>
                <button class="wishlist-btn" data-id="${note.id}"><i class="far fa-heart"></i></button>
            </div>
        </div>
    </div>
`).join('');

    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const noteId = parseInt(this.getAttribute('data-id'));
            addToCart(noteId);
        });
    });

    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function () {
            const noteId = parseInt(this.getAttribute('data-id'));
            addToWishlist(noteId);
        });
    });
}

// Get subject name from slug
function getSubjectName(subjectSlug) {
    const subjects = {
        'math': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology'
    };
    return subjects[subjectSlug] || subjectSlug;
}

// Set up category buttons
function setupCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterNotesByCategory(category);
        });
    });
}

// Filter notes by category
function filterNotesByCategory(category) {
    if (category === 'all') {
        renderNotes(notes, 'all-notes');
    } else {
        const filteredNotes = notes.filter(note => note.subject === category);
        renderNotes(filteredNotes, 'all-notes');
    }
}

// Set up filters on notes page
function setupFilters() {
    const searchInput = document.getElementById('notes-search');
    const subjectFilter = document.getElementById('subject-filter');
    const sortBy = document.getElementById('sort-by');

    // Search filter
    searchInput.addEventListener('input', function () {
        applyFilters();
    });

    // Subject filter
    subjectFilter.addEventListener('change', function () {
        applyFilters();
    });

    // Sort by
    sortBy.addEventListener('change', function () {
        applyFilters();
    });
}

// Apply all filters
function applyFilters() {
    const searchTerm = document.getElementById('notes-search').value.toLowerCase();
    const subject = document.getElementById('subject-filter').value;
    const sortBy = document.getElementById('sort-by').value;

    let filteredNotes = [...notes];

    // Apply search filter
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.topics.some(topic => topic.toLowerCase().includes(searchTerm))
        );
    }

    // Apply subject filter
    if (subject !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.subject === subject);
    }

    // Apply sorting
    filteredNotes.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'pages-asc') return a.pages - b.pages;
        if (sortBy === 'pages-desc') return b.pages - a.pages;
        return 0;
    });

    renderNotes(filteredNotes, 'all-notes');
}

// Set up global search
function setupGlobalSearch() {
    const globalSearch = document.getElementById('global-search');
    const searchBtn = document.getElementById('search-btn');

    function performSearch() {
        const searchTerm = globalSearch.value.trim().toLowerCase();
        if (searchTerm) {
            const results = notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.subject.toLowerCase().includes(searchTerm) ||
                note.topics.some(topic => topic.toLowerCase().includes(searchTerm))
            );

            if (results.length > 0) {
                // If on notes page, filter there
                if (document.getElementById('all-notes')) {
                    document.getElementById('notes-search').value = searchTerm;
                    applyFilters();
                }
                // Otherwise redirect to notes page with search
                else {
                    window.location.href = `notes.html?search=${encodeURIComponent(searchTerm)}`;
                }
            } else {
                alert('No notes found matching your search');
            }
        }
    }

    globalSearch.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') performSearch();
    });

    searchBtn.addEventListener('click', performSearch);

    // Check for search query in URL
    if (document.getElementById('all-notes')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            document.getElementById('notes-search').value = searchQuery;
            applyFilters();
        }
    }
}

// Add to wishlist
function addToWishlist(noteId) {
    const note = notes.find(n => n.id === noteId);
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (!wishlist.some(item => item.id === noteId)) {
        wishlist.push({
            id: note.id,
            title: note.title,
            price: note.price,
            image: note.image
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // Show notification
        showNotification(`${note.title} added to wishlist!`);

        // Update heart icon
        document.querySelector(`.wishlist-btn[data-id="${noteId}"] i`).className = 'fas fa-heart';
    } else {
        showNotification(`${note.title} is already in your wishlist!`);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Set up success page
function setupSuccessPage() {
    if (document.getElementById('download-list')) {
        const downloadLinks = JSON.parse(sessionStorage.getItem('downloadLinks')) || [];

        if (downloadLinks.length > 0) {
            document.getElementById('download-list').innerHTML = downloadLinks;
        } else {
            document.querySelector('.download-section').innerHTML = `
            <p>No downloads found. Please contact support if you've already paid.</p>
        `;
        }
    }
}

// Add to cart (defined in cart.js)
function addToCart(noteId) {
    const note = notes.find(n => n.id === noteId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === noteId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: note.id,
            title: note.title,
            price: note.price,
            file: note.file,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${note.title} added to cart!`);
}

// Update cart count (defined in cart.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Initialize cart count
updateCartCount();    