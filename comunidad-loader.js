document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const container = document.getElementById('publicidad-dinamica-container');

    db.collection('publicidad').orderBy('createdAt', 'desc').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                return;
            }

            let html = '';
            querySnapshot.forEach(doc => {
                const item = doc.data();
                const titulo = item.titulo || 'Publicidad sin título';
                const descripcion = item.descripcion || '';
                const imageUrl = item.imageUrl || 'img/placeholder.svg';
                const ctaTexto = item.ctaTexto;
                const ctaUrl = item.ctaUrl;

                // Construimos el botón solo si hay texto y URL para él
                let botonHtml = '';
                if (ctaTexto && ctaUrl) {
                    botonHtml = `<a href="${ctaUrl}" target="_blank" class="btn btn-purple">${ctaTexto}</a>`;
                }

                const card = `
                    <div class="col-lg-9 col-md-11">
                        <div class="comunidad-fila-card mb-4">
                            <div class="comunidad-fila-img">
                                <img src="${imageUrl}" alt="${titulo}">
                            </div>
                            <div class="comunidad-fila-body">
                                <h5 class="comunidad-card-title">${titulo}</h5>
                                <p class="comunidad-card-text">${descripcion}</p>
                                ${botonHtml}
                            </div>
                        </div>
                    </div>
                `;
                html += card;
            });

            container.innerHTML = html;
        })
        .catch(error => {
            console.error("Error al cargar la publicidad dinámica: ", error);
            container.innerHTML = '<p class="text-danger">No se pudo cargar la publicidad dinámica. Inténtalo de nuevo más tarde.</p>';
        });
});
