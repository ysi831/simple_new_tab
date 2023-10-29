const app = {
  data: {
    columns: JSON.parse(localStorage.getItem('columns')) || [[], [], []],
    currentColumn: 0,
    locked: localStorage.getItem('locked') == 'true',
  },
  methods: {
    initialize(){
      // app.methodsなしで使えるようにする
      for (const [key, func] of Object.entries(app.methods)) {
        window[key] = func;
      }
    },
    openModal(column) {
      app.data.currentColumn = column;
      document.querySelector('#bookmarkName').value = '';
      document.querySelector('#bookmarkUrl').value = '';
      document.querySelector('#bookmarkModal').classList.add('is-active');
    },
    closeModal() {
      document.querySelector('#bookmarkModal').classList.remove('is-active');
    },
    addBookmarkFromModal() {
      const name = document.querySelector('#bookmarkName').value;
      const url = document.querySelector('#bookmarkUrl').value;
      addBookmark(app.data.currentColumn, name, url);
      closeModal();
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
      document.querySelector('#edit-name').value = item.name;
      document.querySelector('#edit-url').value = item.url;
      app.data.currentEdit = { columnIndex, itemIndex };
      document.querySelector('#edit-modal').classList.add('is-active');
    },

    closeEditModal() {
      document.querySelector('#edit-modal').classList.remove('is-active');
      app.data.currentEdit = { columnIndex: null, itemIndex: null };
    },
    setDisplayName() {
      const name = document.querySelector('#bookmarkName').value;
      if (name) { return; }
      const url = document.querySelector('#bookmarkUrl').value;
      const autoName = extractSiteName(url)
      document.querySelector('#bookmarkName').value = autoName;
    },
    saveEdit() {
      const { columnIndex, itemIndex } = app.data.currentEdit;
      const newName = document.querySelector('#edit-name').value;
      const newUrl = document.querySelector('#edit-url').value;
      app.data.columns[columnIndex][itemIndex].name = newName;
      app.data.columns[columnIndex][itemIndex].url = newUrl;
      closeEditModal();
      app.render();
    },
    removeItem(column, index) {
      if (confirm('削除しますか？')) {
        app.data.columns[column].splice(index, 1);
        app.render();
      }
    },
    updateColumnsData(columnIndex) {
      const columnElem = document.querySelector(`#list-${columnIndex}`);
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
        new Sortable(document.querySelector(`#list-${i}`), {
          group: 'shared',
          animation: 150,
          onUpdate: function(evt) {
            const columnIndex = parseInt(evt.from.id.split('-')[1]);
            updateColumnsData(columnIndex);
            saveState();
          }
        });
      }
    },
    saveState() {
      localStorage.setItem('columns', JSON.stringify(app.data.columns));
      localStorage.setItem('locked', app.data.locked);
    },
    toggleButtons(event) {
      if (event) {
        app.data.locked = document.querySelector('#btn-toggle').checked;
      }
      const isChecked = app.data.locked;

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
      if (event) { saveState(); }
    }
  },
  render() {
    const columnTemplates = app.data.columns.map((column, columnIndex) => {
      const items = column.map((item, itemIndex) => {
        if (!item) { return; }
        if (item.type === 'bookmark') {
          return `
            <li data-name=${escapedHTML(item.name)} data-url=${safeURL(item.url)} data-type='bookmark'>
              <div class="is-pulled-left is-flex is-align-items-center">
                <img class='mr-1' src="${getFavicon(item.url)}">
                <a href="${safeURL(item.url)}" rel="noopener noreferrer">${escapedHTML(item.name)}</a>
              </div>
              <div class="is-pulled-right is-flex is-align-items-center">
                <button
                  id="edit-button-${columnIndex}-${itemIndex}"
                  class="button is-info is-small mr-1 editor">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  id="remove-button-${columnIndex}-${itemIndex}"
                  class="button is-danger is-small editor">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </li>`;
        } else if (item.type === 'hr') {
          return `
            <li data-type='hr'>
              <hr>
              <button
                id="hr-remove-button-${columnIndex}-${itemIndex}"
                class="button is-danger is-small ml-2 editor">
                <i class="fas fa-trash"></i>
              </button>
            </li>`;
        }
      }).join('');

      return `
        <div class="column">
          <ul id="list-${columnIndex}" class="sortable">${items}</ul>
          <button
            id="add-button-${columnIndex}"
            class="button is-info mb-2 editor">
            <i class="fas fa-plus"></i>
          </button>
          <button
            id="add-hr-button-${columnIndex}"
            class="button is-info mb-2 editor">
            <i class="fas fa-plus mr-2 "></i> 横線追加
          </button>
        </div>`;
    }).join('');

    const template = `
      <div class="column">
        <div class="level">
          <div class="level-left">
            Bookmarker Web
          </div>
          <div class="level-right">
            <input type="checkbox" id="btn-toggle" class="mr-1 switch" ${(app.data.locked) ? "checked" : ''} name="switchRoundedDefault">
            <label for="switchRoundedDefault">
              <span class="mr-2"><i class="fas fa-lock"></i></span>
            </label>
            <i id="openModal" class="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>

      <div class="container is-fluid">
        <div class="columns">
          ${columnTemplates}
        </div>
      </div>`;

    document.querySelector('#app').innerHTML = template;

    app.data.columns.forEach((column, columnIndex) => {
      document.querySelector(`#add-button-${columnIndex}`).addEventListener('click', () =>
        openModal(columnIndex)
      );
      document.querySelector(`#add-hr-button-${columnIndex}`).addEventListener('click', () =>
        addHR(columnIndex)
      );

      column.forEach((item, itemIndex) => {
        if (item.type === 'bookmark') {
          document.querySelector(`#edit-button-${columnIndex}-${itemIndex}`).addEventListener('click', () => openEditModal(columnIndex, itemIndex));
          document.querySelector(`#remove-button-${columnIndex}-${itemIndex}`).addEventListener('click', () => removeItem(columnIndex, itemIndex));
        } else if (item.type === 'hr') {
          document.querySelector(`#hr-remove-button-${columnIndex}-${itemIndex}`).addEventListener('click', () => removeItem(columnIndex, itemIndex));
        }
      });
    });

    document.querySelector('#openModal').addEventListener('click', settingsModal.methods.open);
    document.querySelector('#btn-toggle').addEventListener('click', toggleButtons);

    sortable();
    saveState();
  }
};

app.methods.initialize();
app.render();

document.querySelector('.add-bookmark').addEventListener('click', addBookmarkFromModal);

document.querySelector('#bookmarkUrl').addEventListener('change', setDisplayName);

document.querySelector('.edit-bookmark').addEventListener('click', saveEdit);
document.querySelector('.close-modal').addEventListener('click', closeModal);
document.querySelector('.close-edit-modal').addEventListener('click', closeEditModal);
document.querySelector('.cancel-add').addEventListener('click', closeModal);
document.querySelector('.cancel-edit').addEventListener('click', closeEditModal);

toggleButtons(true);
