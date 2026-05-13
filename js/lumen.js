const lumenSection = document.querySelector('.lumen-scroll-section');

if (lumenSection) {
    const particles = document.createElement('div');
    particles.className = 'lumen-particles';
    lumenSection.appendChild(particles);

    for (let i = 0; i < 44; i++) {
        const particle = document.createElement('span');
        const size = Math.random() * 4 + 2;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 6 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 6}s`;

        particles.appendChild(particle);
    }

    const counters = lumenSection.querySelectorAll('[data-count]');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach((counter) => {
            const target = Number(counter.dataset.count);
            const duration = 1300;
            const startTime = performance.now();

            function update(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(target * progress);
                counter.textContent = value.toLocaleString('pt-BR');

                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }

    function handleScroll() {
        const rect = lumenSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visible = rect.top < windowHeight * 0.72 && rect.bottom > windowHeight * 0.22;

        if (visible) {
            lumenSection.classList.add('active');
            animateCounters();
        }

        const parallaxValue = Math.max(Math.min(-rect.top * 0.16, 90), -90);
        lumenSection.style.setProperty('--parallax-y', `${parallaxValue}px`);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
}
