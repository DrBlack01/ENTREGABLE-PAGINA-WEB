document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const noticiasContainer = document.getElementById('comunidad-noticias');

    db.collection('noticias').orderBy('createdAt', 'desc').get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                noticiasContainer.innerHTML = "<p class='text-light'>Aún no hay noticias de la comunidad.</p>";
                return;
            }

            querySnapshot.forEach(doc => {
                const noticia = doc.data();
                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card card-noticia h-100 shadow-sm">
                            <img src="${noticia.imageUrl}" class="card-img-top" alt="${noticia.titulo}">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <a href="#" class="text-decoration-none text-newsletter">${noticia.titulo}</a>
                                </h6>
                                <p class="card-text text-newsletter">${noticia.descripcion.substring(0, 100)}...</p>
                                <p class="card-text"><small class="text-newsletter">${new Date(noticia.createdAt.seconds * 1000).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                `;
                noticiasContainer.innerHTML += card;
            });
        })
        .catch(error => {
            console.error("Error al cargar las noticias de la comunidad: ", error);
            noticiasContainer.innerHTML = "<p class='text-danger'>No se pudieron cargar las noticias de la comunidad.</p>";
        });
});
