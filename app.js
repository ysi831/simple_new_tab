const app = {
  data: {
    columns: JSON.parse(localStorage.getItem('columns')) || [[], [], []],
    currentColumn: 0,
    locked: localStorage.getItem('locked') == 'true',
  },
  methods: {
    openModal(column) {
      app.data.currentColumn = column;
      document.getElementById('bookmarkModal').classList.add('is-active');
    },
    closeModal() {
      document.getElementById('bookmarkModal').classList.remove('is-active');
    },
    addBookmarkFromModal() {
      const name = document.getElementById('bookmarkName').value;
      const url = document.getElementById('bookmarkUrl').value;
      app.methods.addBookmark(app.data.currentColumn, name, url);
      app.methods.closeModal();
      app.render();
    },
    addBookmark(column, name, url) {
      app.data.columns[column].push({type: 'bookmark', name: name, url: url});
      app.render();
    },
    addHR(column) {
      app.data.columns[column].push({type: 'hr'});
      app.render();
    },
    openEditModal(columnIndex, itemIndex) {
        const item = app.data.columns[columnIndex][itemIndex];
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-url').value = item.url;
        app.data.currentEdit = { columnIndex, itemIndex };
        document.getElementById('edit-modal').classList.add('is-active');
    },

    closeEditModal() {
        document.getElementById('edit-modal').classList.remove('is-active');
        app.data.currentEdit = { columnIndex: null, itemIndex: null };
    },

    saveEdit() {
        const { columnIndex, itemIndex } = app.data.currentEdit;
        const newName = document.getElementById('edit-name').value;
        const newUrl = document.getElementById('edit-url').value;
        app.data.columns[columnIndex][itemIndex].name = newName;
        app.data.columns[columnIndex][itemIndex].url = newUrl;
        app.methods.closeEditModal();
        app.render();
    },
    removeItem(column, index) {
      if (confirm('削除しますか？')) {
        app.data.columns[column].splice(index, 1);
        app.render();
      }
    },
    updateColumnsData(columnIndex) {
      const columnElem = document.getElementById(`list-${columnIndex}`);
      const updatedColumn = Array.from(columnElem.children).map(li => {
        if (li.tagName === 'LI' && li.dataset.type === 'bookmark') {
          return {
            type: 'bookmark',
            name: li.dataset.name,
            url: li.dataset.url
          };
        } else if (li.tagName === 'LI' && li.dataset.type === 'hr') {
          return { type: 'hr' };
        }
      });

      app.data.columns[columnIndex] = updatedColumn;
    },
    sortable() {
      for (let i = 0; i < 3; i++) {
        new Sortable(document.getElementById(`list-${i}`), {
          group: 'shared',
          animation: 150,
          onUpdate: function(evt) {
            const columnIndex = parseInt(evt.from.id.split('-')[1]);
            app.methods.updateColumnsData(columnIndex);
            app.methods.saveState();
          }
        });
      }
    },
    saveState() {
      localStorage.setItem('columns', JSON.stringify(app.data.columns));
      localStorage.setItem('locked', app.data.locked);
    },
    toggleButtons(initial=false) {
      const isChecked = document.getElementById('btn-toggle').checked;

      const buttonsToggleModule = (() => {
        const buttons = document.querySelectorAll('.editor');
        buttons.forEach(btn => {
          btn.style.display = isChecked ? 'none' : '';
        });
      })();

      const borderToggleModule = (() => {
        const columns = document.querySelectorAll('.column');
        columns.forEach(column => {
          if (isChecked) {
            column.classList.remove('bordered-column');
          } else {
            column.classList.add('bordered-column');
          }
        });
      })();

      app.data.locked = isChecked;
      if (!initial) { app.methods.saveState(); }
    }
  },
  render() {
    const columnTemplates = app.data.columns.map((column, columnIndex) => {
      const items = column.map((item, itemIndex) => {
        if (!item) { return; }
        if (item.type === 'bookmark') {
          const encodedURL = encodeURIComponent(item.url);
          return `
          <li data-name=${item.name} data-url=${item.url} data-type='bookmark'>
            <div class="is-pulled-left is-flex is-align-items-center">
              <img class='mr-1' src="${getFavicon(item.url)}"">
              <a href="${item.url}" rel="noopener noreferrer">${item.name}</a>
            </div>
            <div class="is-pulled-right is-flex is-align-items-center">
              <button
                class="button is-info is-small mr-1 editor"
                onclick="app.methods.openEditModal(${columnIndex}, ${itemIndex})">
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="button is-danger is-small editor"
                onclick="app.methods.removeItem(${columnIndex}, ${itemIndex})">
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </li>`;
        } else if (item.type === 'hr') {
          return `
          <li data-type='hr'>
            <hr>
            <button class="button is-danger is-small ml-2 editor"
              onclick="app.methods.removeItem(${columnIndex}, ${itemIndex})">
              <i class="fas fa-minus"></i>
            </button>
          </li>`;
        }
      }).join('');

      return `
        <div class="column">
          <ul id="list-${columnIndex}" class="sortable">${items}</ul>
          <button class="button is-info mb-2 editor" onclick="app.methods.openModal(${columnIndex})">
            <i class="fas fa-plus"></i>
          </button>
          <button class="button is-info mb-2 editor" onclick="app.methods.addHR(${columnIndex})">
            <i class="fas fa-minus"></i> 横線追加
          </button>
        </div>`;
    }).join('');

    const template = `
      <div class="column has-text-right">
        <div class="field">
          <input type="checkbox" id="btn-toggle" class="switch" ${(app.data.locked) ? "checked" : ''} name="switchRoundedDefault" onclick="app.methods.toggleButtons()">
          <label for="switchRoundedDefault">
            <span class="mr-2"><i class="fas fa-lock"></i></span>
          </label>
          <i id="openModal" class="fa-solid fa-gear"></i>
        </div>
      </div>

      <div class="container is-fluid">
        <div class="columns">
          ${columnTemplates}
        </div>
      </div>`;

    document.getElementById('app').innerHTML = template;

    app.methods.sortable();
    app.methods.saveState();
  }
};

document.querySelector('.add-bookmark').addEventListener('click', app.methods.addBookmarkFromModal);
document.querySelector('.edit-bookmark').addEventListener('click', app.methods.saveEdit);
document.querySelector('.close-modal').addEventListener('click', app.methods.closeModal);
document.querySelector('.close-edit-modal').addEventListener('click', app.methods.closeEditModal);
document.querySelector('.cancel-add').addEventListener('click', app.methods.closeModal);
document.querySelector('.cancel-edit').addEventListener('click', app.methods.closeEditModal);
document.querySelector('.modal .delete').addEventListener('click', app.methods.closeModal);

app.render();

app.methods.toggleButtons(true);
settingsModal.methods.init('#openModal', '#settings-modal');




