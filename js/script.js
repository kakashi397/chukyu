/* 
スムーススクロール
*/
// ヘッダー縦幅分スクロール量を減らすので、その時に必要
const header = document.querySelector('.l-header');
// 値の先頭に#を持つ(ページ内リンク)href属性を持つa要素を取得
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

// 実際のスクロール処理はここから
for (const link of smoothScrollLinks) { // 取得したa要素を個々に定数linkに代入
  link.addEventListener('click', (e) => { // 個々のlinkにイベントリスナー(クリック)を持たせて、イベント発生時に得られる情報を変数eに代入
    e.preventDefault(); // aがクリックされたとき該当箇所まで一瞬でジャンプする動作をキャンセル

    // 右辺：headerに要素が見つかればその要素の高さを、見つからなければ0を
    const headerHeight = header ? header.offsetHeight : 0;
    // linkのhref属性(Attribute)の値を定数hrefに個々に代入
    const href = link.getAttribute('href');

    if (href === '#') { // #のみ(ページトップのこと)ならば
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const target = document.querySelector(href); // #○○を個々に定数targetに代入
      if (target) { //targetに中身があるなら(nullじゃなければ)
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight; // 画面上端から#○○の上端の距離(target.getBoundingClientRect().top) と ページ上端と画面上端の距離(window.scrollY) を足し、ヘッダーの縦幅分スクロール量を減らしている
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
}


/* 
フォームのサブミット制御
*/
const form = document.querySelector('.js-request-form');
const submitBtn = form.querySelector('.js-submit');
const inputs = form.querySelectorAll('.js-input');

function checkInputStatus() {
  let isAllFilled = true;

  for(const input of inputs) {
    if(input.value.trim() === '') {
      isAllFilled = false;
      break;
    }
  }

  submitBtn.disabled = !isAllFilled;
}