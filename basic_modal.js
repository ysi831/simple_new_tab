const settingsModal = {
  data: {
    modalElement: null
  },
  methods: {
    init(buttonClass, modalClass) {
      document.querySelector(buttonClass).addEventListener("click", () => {
        settingsModal.methods.open();
      });

      settingsModal.data.modalElement = document.querySelector(modalClass);
      document.querySelector('.settings-modal-close').addEventListener('click', settingsModal.methods.close);
    },
    open() {
      settingsModal.data.modalElement.classList.add('is-active');
    },
    close() {
      settingsModal.data.modalElement.classList.remove('is-active');
    },
  }
};
