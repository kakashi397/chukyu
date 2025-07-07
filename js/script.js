const header = document.querySelector('.l-header');
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

for (const link of smoothScrollLinks) {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;
    const href = link.getAttribute('href');

    if (href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
}