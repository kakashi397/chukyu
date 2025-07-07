/*
自作フォームとグーグルフォームを連携させる
*/
const form = document.getElementById('request-form');

form.addEventListener('submit', function (e) {
  e.preventDefault(); // ページ遷移を防ぐ！

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    mode: 'no-cors', // ←これが重要（GoogleフォームはCORS許可してない）
    body: formData
  }).then(() => {
    alert('送信しました！');
    form.reset(); // フォームのリセット（任意）
  }).catch(() => {
    alert('送信に失敗しました。');
  });
});

/*
スムーススクロール
*/
// ヘッダー要素を取得
const header = document.querySelector('.l-header');
// aタグのhref属性が#で始まるものを全て取得
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

// 取得したaタグ全てにクリックイベントを追加
for (const link of smoothScrollLinks) {
  link.addEventListener('click', (e) => {
    // aタグのデフォルトの挙動（画面遷移）を無効化
    e.preventDefault();

    // ヘッダーの高さを取得
    const headerHeight = header ? header.offsetHeight : 0;
    // aタグのhref属性の値を取得
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