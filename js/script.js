/* カルーセル */
window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.js-logo-track');

  if(!track) return;

  const oneSetWidth = track.scrollWidth / 2;
  console.log('1セットの幅:', oneSetWidth);
  track.style.setProperty('--scroll-end', `-${oneSetWidth}px`);

});