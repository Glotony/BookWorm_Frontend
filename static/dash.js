// BookWorm Library Management System - JavaScript

// Global variables for chart data
let borrowedBooks = 85;
let returnedBooks = 32;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    setupEventListeners();
    updateDateTime();
});

// Initialize and animate the pie chart
function initChart() {
    const totalBooks = borrowedBooks + returnedBooks;
    const borrowedPercentage = (borrowedBooks / totalBooks) * 100;
    const circumference = 2 * Math.PI * 80; // r = 80
    const borrowedArcLength = (borrowedPercentage / 100) * circumference;

    const borrowedArc = document.getElementById('borrowed-arc');

    // Animate the chart after a short delay
    setTimeout(() => {
        if (borrowedArc) {
            borrowedArc.style.strokeDasharray = `${borrowedArcLength} ${circumference}`;
        }
    }, 500);
}

// Handle card click events
function handleCardClick(type) {
    switch(type) {
        case 'borrowed':
            showModal('Borrowed Books', `You have ${borrowedBooks} borrowed books`, 'borrowed');
            break;
        case 'returned':
            showModal('Returned Books', `You have returned ${returnedBooks} books`, 'returned');
            break;
        case 'browse':
            showModal('Browse Inventory', 'Opening book inventory...', 'browse');
            break;
        case 'mybooks':  // Navigate to finished books page
            window.location.href = "yourreadbooks.html";
            break;
        default:
            console.log('Unknown card type:', type);
    }
}

// Show modal or alert (can be customized later)
function showModal(title, message, type) {
    alert(`${title}\n\n${message}`);
    console.log(`User clicked: ${type} - ${title}`);
}

// Update chart data dynamically
function updateChart(borrowed, returned) {
    if (borrowed < 0 || returned < 0) {
        console.error('Invalid chart data: values must be non-negative');
        return;
    }

    borrowedBooks = borrowed;
    returnedBooks = returned;

    const borrowedCountElement = document.getElementById('borrowed-count');
    const returnedCountElement = document.getElementById('returned-count');

    if (borrowedCountElement) borrowedCountElement.textContent = borrowed;
    if (returnedCountElement) returnedCountElement.textContent = returned;

    const totalBooks = borrowedBooks + returnedBooks;
    if (totalBooks === 0) {
        console.warn('No books data to display');
        return;
    }

    const borrowedPercentage = (borrowedBooks / totalBooks) * 100;
    const circumference = 2 * Math.PI * 80;
    const borrowedArcLength = (borrowedPercentage / 100) * circumference;

    const borrowedArc = document.getElementById('borrowed-arc');
    if (borrowedArc) {
        borrowedArc.style.strokeDasharray = `${borrowedArcLength} ${circumference}`;
    }

    console.log(`Chart updated: ${borrowed} borrowed, ${returned} returned`);
}

// Setup all event listeners
function setupEventListeners() {
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    const settingsIcon = document.querySelector('.settings-icon');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', handleSettings);
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', () => handleSidebarNavigation(index));
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        const type = card.getAttribute('data-type');
        card.addEventListener('click', () => handleCardClick(type));
    });
}

// Handle share button click
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'BookWorm Library Management System',
            text: 'Check out my library dashboard!',
            url: window.location.href
        }).catch(console.error);
    } else {
        copyToClipboard(window.location.href);
        alert('Link copied to clipboard!');
    }
}

// Copy to clipboard fallback
function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

// Handle settings icon click
function handleSettings() {
    alert('Settings panel would open here');
    console.log('Settings clicked');
}

// Handle sidebar navigation
function handleSidebarNavigation(index) {
    switch(index) {
        case 0:
            showModal('Dashboard', 'Navigating to the dashboard...', 'dashboard');
            break;
        case 1:
            showModal('My Books', 'Opening your read and returned books...', 'my-books');
            break;
        case 2:
            showModal('Inventory', 'Accessing the full book inventory...', 'inventory');
            break;
        case 3:
            showModal('Reports', 'Loading library reports...', 'reports');
            break;
        case 4:
            showModal('Help', 'Need assistance? Here’s the help section.', 'help');
            break;
        default:
            console.warn('Unhandled sidebar index:', index);
    }
}

// Optional: Update time in UI (you can hook this to an element if needed)
function updateDateTime() {
    const now = new Date();
    console.log(`Page loaded at: ${now.toLocaleString()}`);
}
