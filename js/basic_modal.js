const settingsModal = {
  data: {
    modalElement: null
  },
  methods: {
    open() {
      document.querySelector('.settings-modal').classList.add('is-active');
    },
    close() {
      document.querySelector('.settings-modal').classList.remove('is-active');
    },
  },
  render() {
    const template = `
      <div class="modal settings-modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title"></p>
            <button class="delete settings-modal-close" aria-label="close"></button>
          </header>
          <section class="modal-card-body">

            <h2>このアプリについて</h2>
            <p><b>Simple New Tab</b>は、は、新しいタブページを独自のブックマークリストに置き換えるシンプルなChrome拡張です。</p>
            <br>
            <p>Chromeのブックマークとは連携しないため、独自のブックマークを自分で登録して使うことができます。</p>

            <p>アイコンは自動で取得されます。</p>

            <br>
            <h2 id="使い方"><a class="anchor" name="使い方" href="#使い方"><span class="octicon octicon-link"></span></a>使い方</h2>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>＋ボタン</b>
              </div>
              <div class="column">
                <span>ブックマークの登録</span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>＋区切り線追加ボタン</b>
              </div>
              <div class="column">
                <span>ブックマークを区切る横線の追加</span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>鉛筆ボタン</b>
              </div>
              <div class="column">
                <span>追加したブックマークの編集</span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>ゴミ箱ボタン</b>
              </div>
              <div class="column">
                <span>追加したブックマーク・区切り線の削除</span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>(右上)錠前チェックボックス</b>
              </div>
              <div class="column">
                <span>編集・削除ボタンを非表示にする</span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-narrow is-6">
                <b>(右上)歯車</b>
              </div>
              <div class="column">
                <span>設定</span>
              </div>
            </div>

            <br>
            <h2 id="起動時にも開く設定"><a class="anchor" name="起動時にも開く設定" href="#起動時にも開く設定"><span class="octicon octicon-link"></span></a>起動時にも開く設定</h2>
            <p>Chromeの設定から、「起動時」→「新しいタブページを開く」にすることで起動にもこの拡張機能のページを開くことができます。</p>

            <br>
            <h2 id="その他"><a class="anchor" name="その他" href="#その他"><span class="octicon octicon-link"></span></a>その他</h2>
            <p>&#8226;この拡張機能は無料ですが、課金して開発者をサポートできます。<br>
              もしよかったら開発継続のためご協力ください。</p>
            <p>&#8226;ユーザーの情報を収集・閲覧することは一切ありません。</p>

          </section>
          <footer class="modal-card-foot license">
            Copyright <a href="https://www.mpo-gg.com">© mpo-gg.com</a>
          </footer>
        </div>
      </div>`;
    document.querySelector('.settings-modal-wrap').innerHTML = template;
  }
};

settingsModal.render()
document.querySelector('.settings-modal-close').addEventListener('click', settingsModal.methods.close);

