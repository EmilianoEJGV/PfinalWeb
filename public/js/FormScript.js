document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.imageUrl) {
                // Ahora tenemos la URL de la imagen, agreguemos la noticia
                const newsData = {
                    title: form.title.value,
                    content: form.content.value,
                    body: form.body.value,
                    imageUrl: data.imageUrl,
                    newsDate: form.newsDate.value
                };

                return fetch('/api/news', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newsData)
                });
            } else {
                throw new Error('Error al cargar la imagen');
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // O muestra un mensaje de éxito en tu página
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al publicar la noticia.');
        });
    });
});



