document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // Suggest Form Logic
    const form = document.getElementById('suggest-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                dishName: document.getElementById('dishName').value,
                dishDesc: document.getElementById('dishDesc').value,
                phoneNum: document.getElementById('phoneNum').value
            };

            try {
                // Google Apps Script deployment URL
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbyhDrDcfh--_kOttbGVeTdXMcS5mY7Uz-ha6kXSRmJIERq8g5ETXPlxodp-YscFwGr7/exec';

                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Idea submitted! We will announce the winner on Sunday via WhatsApp.');
                    form.reset();
                } else {
                    alert('Error submitting idea. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting idea. Please try again.');
            }
        });
    }

    // Voting Buttons with localStorage persistence
    const voteBtns = document.querySelectorAll('.vote-btn');
    const userVotedDishes = new Set(JSON.parse(localStorage.getItem('votedDishes') || '[]'));

    // Initialize vote counts from localStorage on page load
    voteBtns.forEach(btn => {
        const dishName = btn.getAttribute('data-dish');
        const voteCard = btn.closest('.vote-card');
        const voteCountEl = voteCard.querySelector('.vote-count');

        // Load stored vote count
        const storedVotes = localStorage.getItem(`votes_${dishName}`);
        if (storedVotes) {
            voteCountEl.textContent = storedVotes + ' votes';
        }

        // Check if user has already voted for this dish
        if (userVotedDishes.has(dishName)) {
            btn.classList.add('voted');
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
            btn.innerHTML = '<i class="fas fa-check"></i> Voted';
            btn.disabled = true;
        }
    });

    // Add click handlers
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dishName = this.getAttribute('data-dish');

            if (!userVotedDishes.has(dishName)) {
                userVotedDishes.add(dishName);
                localStorage.setItem('votedDishes', JSON.stringify(Array.from(userVotedDishes)));

                // Increment vote count
                const voteCard = this.closest('.vote-card');
                const voteCountEl = voteCard.querySelector('.vote-count');

                // Extract number from text like "100 votes"
                const voteText = voteCountEl.textContent.trim();
                const currentVotes = parseInt(voteText.split(' ')[0]) || 0;
                const newVotes = currentVotes + 1;

                // Update the vote count text
                voteCountEl.textContent = newVotes + ' votes';

                // Store the new vote count
                localStorage.setItem(`votes_${dishName}`, newVotes);

                // Update button appearance
                this.classList.add('voted');
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');
                this.innerHTML = '<i class="fas fa-check"></i> Voted';
                this.disabled = true;
            }
        });
    });

    console.log('Legpiece on Call - Premium Experience Loaded');
});
