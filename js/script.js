/* 
スムーススクロール
*/
// ヘッダー縦幅分スクロール量を減らすので、その時に必要
const header = document.querySelector('.js-header');
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
フェードイン
*/
// 監視対象が範囲内に入ったら実行する処理
const fadeIn = (entries, obs) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) {
      entry.target.animate(
        {
          opacity: [0, 1],
          filter: ['blur(.4rem)', 'blur(0)'],
          translate: ['0 3rem', 0],
        },
        {
          duration: 2000,
          easing: 'ease',
          fill: 'forwards',
        },
      );
      obs.unobserve(entry.target);
    }
  });
}; 
// オブザーバーの設定
const fadeInObserver = new IntersectionObserver(fadeIn);

// .js-fade-inを監視するよう指示
const fadeElements = document.querySelectorAll('.js-fade-in');
fadeElements.forEach((fadeElement) => {
  fadeInObserver.observe(fadeElement);
});



/* 
ハンバーガーメニュー
*/
const hamburgerBtn = document.querySelector('.js-hamburger-btn');
const nav = document.querySelector('.js-nav-sp');
const navLinks = nav.querySelectorAll('a');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('is-open');
  nav.classList.toggle('is-open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('is-open');
    nav.classList.remove('is-open');
  });
});



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
        submitBtn.style.backgroundColor = '#A9D0EA';
        break; // 処理を終了する
      }
    }
    if (isAllFilled) { // isAllFilledがtrueなら
      submitBtn.disabled = false; // disabledをfalseにする＝ボタンが使える
      submitBtn.style.backgroundColor = '#007FC6';
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
      // alert('送信しました！');
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
const track = document.querySelector('.js-logo-track'); // カルーセル部分の要素全体を取得

// 初期の子要素を保存（1セット分）
const originalItems = Array.from(track.children); // originalItemsにtrack（ul）の子要素（li）を全部配列として入れる

// 現在の複製数（初期1）
let currentSetCount = 1; // 現在、何セット分のアイテムが入っているかを数える変数 後でセット数が偶数か奇数か判定する必要があるため必要な情報

// 複製と偶数チェック
function generateEvenSets() { // generateEvenSets()関数を作る
  track.innerHTML = ''; // 一度中身を初期状態に戻す 一度空にしてから必要なセットを書き込んだ方が、前回の残りを考慮する必要がなくなるため
  originalItems.forEach(item => { // originalItemsに入っているliを一個一個取り出してitemに入れて処理する
    track.appendChild(item.cloneNode(true)); // (親).appendChild(子)は親の中に最後の子要素として子を追加する。 item.cloneNode（true）によりitemを全て（要素と中身まで）コピーしている。（falseなら要素だけ中身無しコピー）
  });
  currentSetCount = 1; // この時点でulの子要素をまっさらにした後1セット分複製してる

  const screenWidth = window.innerWidth; // innerWidthプロパティによってscreenWidthに表示領域の横幅を取得
  const trackWrapper = track.parentElement; // trackの親要素（<div class="p-achievement__logo-carousel">の要素だけを取得）
  const requireWidth = screenWidth * 2; // 最低でも画面の2倍分必要
  let currentWidth = track.scrollWidth; // ulタグ（track）の中に複製されたliたちが横に何ピクセルぶんあるかを取得

  // 必要なだけ複製（set単位で）
  while (currentWidth < requireWidth) { // 今のcurrentWidthが画面幅の二倍よりも少ない間は
    originalItems.forEach(item => { // 1セットを複製して
      track.appendChild(item.cloneNode(true));
    });
    currentSetCount++; // セット数に1を足す
    currentWidth = track.scrollWidth; // 現在の長さを図る
  } //  そしてwhileに戻る

  // 複製数が奇数なら+1セット追加して偶数に
  if (currentSetCount % 2 !== 0) { // もし現在のセット数が2で割り切れない＝奇数なら
    originalItems.forEach(item => { // もう一セット追加で複製
      track.appendChild(item.cloneNode(true));
    });
    currentSetCount++; // セット数に1を足す
  }
}

// 初回実行
generateEvenSets();

// リサイズ対応（連打防止のdebounceつき）
let resizeTimeout;
window.addEventListener('resize', () => { // ウィンドウのサイズが変更されたら発火させるイベントリスナー
  clearTimeout(resizeTimeout); // イベント発火したらまずは予約を削除する
  resizeTimeout = setTimeout(() => { // リサイズがあった0.3秒後にgenerateEvenSets()を実行することを予約する
    generateEvenSets();
  }, 300);
});




/*
スライダー
*/
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true ,
  spaceBetween: 70,
  centeredSlides: true,
  slidesPerView: 'auto',
  breakpoints: {
    991: {
      centeredSlides: false,
      slidesPerGroup: 2,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});


/* 
アコーディオン
*/
const details = document.querySelectorAll('.js-details');
details.forEach((detail) => {
  const summary = detail.querySelector('.js-summary');
  const content = detail.querySelector('.js-content');

  summary.addEventListener('click', (e) => {
    e.preventDefault();

    if(detail.open) {
      content.animate([
        {
          maxHeight: content.scrollHeight + 'px',
          opacity: 1,
        },
        {
          maxHeight: '0',
          opacity: 0,
        }
      ],{
        duration: 300,
        easing: 'ease-out',
        }).onfinish = () => {
          detail.removeAttribute('open');
          content.style.maxHeight = '';
        };
    } else {
      detail.setAttribute('open', '');
      content.animate([
        {
          maxHeight: '0',
          opacity: 0,
        },
        {
          maxHeight: content.scrollHeight + 'px',
          opacity: 1,
        },
      ],{
        duration: 300,
        easing: 'ease-out',
      }).onfinish = () => {
        content.style.maxHeight = '';
      };
    }
  });
});