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
// input要素にrequired属性を付けているのでHTMLでも未入力制御をしているがJSでも二重のチェックをする
const form = document.querySelector('.js-request-form'); // フォームの要素を取得
const inputs = form.querySelectorAll('.js-input'); // フォーム内のinput要素を取得
const submitBtn = form.querySelector('.js-submit');  // submitタイプのinput要素を取得

function checkInputStatus() {
  let isAllFilled = true; // 変数isAllFilledの初期値はtrue

  for(const input of inputs) {  // inputsのなかの各ノードをinputに代入
    if(input.value.trim() === '') { // ユーザーに入力された値の前後の空白をトリミングで除去して、完全な空白になるのなら
      isAllFilled = false; 
      break;
    }
  }
  // submitBtn.disabled = !isAllFilled;　論理のねじれに慣れたらこっちの方がスリム
  if (isAllFilled) { // isAllFilledがtrueなら
    submitBtn.disabled = false; // disabledをfalseにする＝ボタンが使える
  } else { // isAllFilledがfalseなら
    submitBtn.disabled = true; // disabledがtrueになる＝ボタンが使えなくなる
  }
}

form.addEventListener('input', checkInputStatus); // ユーザーが入力する度に発火
document.addEventListener('DOMContentLoaded', checkInputStatus); // ページ読み込み直後に発火


/*
自作フォームとグーグルフォームを連携させる
*/
const formSubmitTatget = document.querySelector('.js-request-form'); // formを取得
const thankYouMessage = document.querySelector('.js-thanks'); // thanksのp要素を取得

formSubmitTatget.addEventListener('submit', function (e) {  //formのsubmitが発動したら発火
  e.preventDefault(); // デフォルトの動作ページ遷移を防ぐ！

  const formData = new FormData(formSubmitTatget);

  fetch(formSubmitTatget.action, {
    method: 'POST',
    mode: 'no-cors', // ←これが重要（GoogleフォームはCORS許可してない）
    body: formData
  }).then(() => {
    alert('送信しました！');

    submitBtn.style.display = 'none'; // 送信したらボタンを非表示
    if (thankYouMessage) {
      thankYouMessage.style.display = 'block'; // 送信したらthankYouMessageを表示
    }
    formSubmitTatget.reset(); // フォームのリセット（任意）
  }).catch(() => {
    alert('送信に失敗しました。');
  });
});