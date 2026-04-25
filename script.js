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

    // Voting Buttons
    const voteBtns = document.querySelectorAll('.vote-btn');
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('voted')) {
                this.classList.add('voted');
                this.innerHTML = '<i class="fas fa-check"></i> Voted';
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');
            }
        });
    });

    console.log('Legpiece on Call - Premium Experience Loaded');
});
