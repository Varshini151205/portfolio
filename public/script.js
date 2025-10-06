const tabs = document.querySelectorAll('.resume-tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const section = tab.dataset.section;

        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and its content
        tab.classList.add('active');
        const activeContent = document.querySelector(`[data-content="${section}"]`);
        activeContent.classList.add('active');

        // Smooth scroll to the content inside resume section
        activeContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});


        // Contact form
        const form = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const formData = new FormData(form);
            const name = formData.get('name');
            
            formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
            formStatus.className = 'form-status success show';
            
            form.reset();
            
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);
        });

        // Set current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();
