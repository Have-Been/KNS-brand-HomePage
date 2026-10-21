const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav a');

// 부드러운 스크롤 애니메이션 (easeInOutCubic)
function smoothScrollTo(targetY, duration = 1000) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, startY + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = target.id === 'top' ? 0 : header.offsetHeight;
        smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset);
    });
});

// 헤더 배경 전환 + 현재 섹션 메뉴 표시
const sections = ['story', 'philosophy', 'principles'].map(id => document.getElementById(id));
function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);

    const pos = window.scrollY + header.offsetHeight + 120;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 스크롤 시 콘텐츠 등장
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
