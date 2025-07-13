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
フォーム関連
*/
const forms = document.querySelectorAll('.js-request-form'); // 同一フォームが２か所に設置してあるのでセレクタオールで全部取得

forms.forEach((form) => { // フォームひとつずつに処理をする
  const inputs = form.querySelectorAll('.js-input'); // フォーム内のインプット要素をすべて取得
  const submitBtn = form.querySelector('.js-submit'); // フォーム内のサブミットボタンを取得
  const thankYouMessage = form.querySelector('.js-thanks'); // フォーム内のサンクスメッセージを取得

  function checkInputStatus() { // 関数を作成
    let isAllFilled = true; // 変数isAllFilledの初期値はtrue

    for(const input of inputs) { // 各インプット要素それぞれに処理
      if(input.value.trim() === '') { // インプット内に入力された値が空白なら
        isAllFilled = false; // 変数isAllFilledをfalseに
        break; // 処理を終了する
      }
    }
    if (isAllFilled) { // isAllFilledがtrueなら
      submitBtn.disabled = false; // disabledをfalseにする＝ボタンが使える
    } else { // isAllFilledがfalseなら
      submitBtn.disabled = true; // disabledがtrueになる＝ボタンが使えなくなる
    }
  }

  form.addEventListener('input', checkInputStatus); // フォームひとつずつにイベントリスナー(インプット)を設定 インプットがある度に関数が発火
  checkInputStatus(); // イベント関係なしに、初期状態のときに一度関数を発火している

  form.addEventListener('submit', function(e) { // イベントリスナー（サブミット）を設定 サブミットがあれば下の関数を発火
    e.preventDefault(); // デフォルトの動作を打ち消す

    const formData = new FormData(form); // 定数formDateに定数formに入っているデータを渡してる

    fetch(form.action, { // フォームの内容をグーグルフォームに送る
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      alert('送信しました！');
      document.querySelectorAll('.js-submit').forEach(btn => btn.style.display = 'none');
      document.querySelectorAll('.js-thanks').forEach(thanks => thanks.style.display = 'block');
      form.reset();
      checkInputStatus();
    }).catch(() => { // thenに行かなかったときのルート
      alert('送信に失敗しました。');
    });
  });
});

/* 
カルーセル
*/
const track = document.querySelector('.js-logo-track');

// 初期の子要素を保存（1セット分）
const originalItems = Array.from(track.children);

// 現在の複製数（初期1）
let currentSetCount = 1;

// 複製と偶数チェック
function generateEvenSets() {
  // 一度中身を初期状態に戻す
  track.innerHTML = '';
  originalItems.forEach(item => {
    track.appendChild(item.cloneNode(true));
  });
  currentSetCount = 1;

  const screenWidth = window.innerWidth;
  const trackWrapper = track.parentElement;
  const requireWidth = screenWidth * 2; // 最低でも画面の2倍分必要
  let currentWidth = track.scrollWidth;

  // 必要なだけ複製（set単位で）
  while (currentWidth < requireWidth) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    currentSetCount++;
    currentWidth = track.scrollWidth;
  }

  // 複製数が奇数なら+1セット追加して偶数に
  if (currentSetCount % 2 !== 0) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    currentSetCount++;
  }
}

// 初回実行
generateEvenSets();

// リサイズ対応（連打防止のdebounceつき）
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    generateEvenSets();
  }, 300); // 0.3秒後に再生成
});




/*
スライダー
*/
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  spaceBetween: 70,
  centeredSlides: true,
  slidesPerView: 'auto',
  breakpoints: {
    991: {
      slidesPerView: 2,
      centeredSlides: false,
      slidesPerGroup: 2,
    },
  },
/*
  現在の書き方は二枚表示の時はカードのwidthをswiperに決めて貰っているslidesPerView：2
これだとスライドする距離は良いがカードのwidthがカンプよりも大きいのでずれている
  */

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },


});


swiper.on('slideChange', function () {
  console.log('現在のインデックス:', swiper.activeIndex);
  console.log('translate値:', swiper.translate);
});