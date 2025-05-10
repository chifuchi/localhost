document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelector('.menu-items');
    
    menuToggle.addEventListener('click', function() {
        menuItems.classList.toggle('active');
    });

    const menuLinks = document.querySelectorAll('.menu-item');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetUrl = this.getAttribute('href');
            window.location.href = targetUrl; // Redirigir correctamente al hacer clic
        });
    });
});