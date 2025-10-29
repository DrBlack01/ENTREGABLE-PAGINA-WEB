document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const publicidadContainer = document.getElementById('publicidad-container');

    db.collection('publicidad').orderBy('createdAt', 'desc').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                publicidadContainer.innerHTML = "<p class='text-light'>Aún no hay publicidad de la comunidad.</p>";
                return;
            }

            querySnapshot.forEach(doc => {
                const ad = doc.data();
                const card = `
                    <div class="comunidad-fila-card mb-4">
                        <div class="comunidad-fila-img">
                            <img src="${ad.imageUrl}" alt="${ad.titulo}">
                        </div>
                        <div class="comunidad-fila-body">
                            <h5 class="comunidad-card-title">${ad.titulo}</h5>
                            <p class="comunidad-card-text">${ad.descripcion}</p>
                            <a href="#" target="_blank" class="btn btn-purple">Ver más</a>
                        </div>
                    </div>
                `;
                publicidadContainer.innerHTML += card;
            });
        })
        .catch(error => {
            console.error("Error al cargar la publicidad: ", error);
            publicidadContainer.innerHTML = "<p class='text-danger'>No se pudo cargar la publicidad.</p>";
        });
});
