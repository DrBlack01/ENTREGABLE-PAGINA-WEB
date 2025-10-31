function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('El contenedor de toasts no se encuentra en la página.');
        alert(message); // Fallback si no hay contenedor
        return;
    }

    const toastId = 'toast-' + Date.now();
    let toastHeaderClass = 'bg-primary'; // default
    if (type === 'success') {
        toastHeaderClass = 'bg-success';
    } else if (type === 'danger') {
        toastHeaderClass = 'bg-danger';
    } else if (type === 'warning') {
        toastHeaderClass = 'bg-warning text-dark';
    }

    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
          <div class="toast-header ${toastHeaderClass} text-white">
            <strong class="me-auto">Notificación</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body bg-dark text-white">
            ${message}
          </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}
