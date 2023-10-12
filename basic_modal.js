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
      settingsModal.data.modalElement.style.display = 'block';
    },
    close() {
      settingsModal.data.modalElement.style.display = 'none';
    },
  }
};
