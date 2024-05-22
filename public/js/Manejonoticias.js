
document.addEventListener('DOMContentLoaded', function() {
    const newsList = document.getElementById('news-list');
    const editNewsForm = document.getElementById('edit-news-form');
    const editForm = document.getElementById('editForm');
    const cancelButton = document.getElementById('cancelButton');
    

    cancelButton.addEventListener('click', cancelEdit);
    function loadNews() {
        fetch('/api/news')
            .then(response => response.json())
            .then(newsListData => {
                renderNewsList(newsListData);
            })
            .catch(error => {
                console.error('Error loading news:', error);
                alert('Hubo un error al cargar las noticias.');
            });
    }

    
    /*function renderNewsList(newsListData) {
        newsList.innerHTML = '';  
        newsListData.forEach(news => {
            const newsItem = document.createElement('div');
            const timeStamp = new Date().getTime();  // Genera un timestamp para la URL de la imagen
            newsItem.innerHTML = `
                <h3>${news.title}</h3>
               
                <p>${news.content}</p>
                <button id="edit-${news.id}">Editar</button>
                <button id="delete-${news.id}">Borrar</button>
            `;
            newsList.appendChild(newsItem);
    
            document.getElementById(`edit-${news.id}`).addEventListener('click', function() {
                editNews(news.id);
            });
    
            document.getElementById(`delete-${news.id}`).addEventListener('click', function() {
                deleteNews(news.id);
            });
        });
    }*/

    function renderNewsList(newsListData) {
        newsList.innerHTML = '';  
        newsListData.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item'); // Añadir clase al contenedor
            const timeStamp = new Date().getTime();  // Genera un timestamp para la URL de la imagen
            newsItem.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <button id="edit-${news.id}" class="edit-btn">Editar</button>
                <button id="delete-${news.id}" class="delete-btn">Borrar</button>
            `;
            newsList.appendChild(newsItem);
    
            document.getElementById(`edit-${news.id}`).addEventListener('click', function() {
                editNews(news.id);
            });
    
            document.getElementById(`delete-${news.id}`).addEventListener('click', function() {
                deleteNews(news.id);
            });
        });
    }
    
    
    

    function hideNewsList() {
        newsList.style.display = 'none';
    }

    function showNewsList() {
        newsList.style.display = 'block';
    }

    function showNewsAndLoad() {
        showNewsList();
        loadNews();
    }

    function editNews(id) {
        fetch(`/api/news/${id}`)
            .then(response => response.json())
            .then(news => {
                editForm['edit-id'].value = news.id;
                editForm['edit-title'].value = news.title;
                editForm['edit-content'].value = news.content;
                editForm['edit-body'].value = news.body; 
                editForm['edit-newsDate'].value = news.newsDate;


                editNewsForm.style.display = 'block';
                hideNewsList();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al cargar la noticia para editar.');
            });
    }

    function cancelEdit() {
        editNewsForm.style.display = 'none';
        showNewsAndLoad();
    }
   

    function deleteNews(id) {
        if (confirm('¿Estás seguro de que quieres borrar esta noticia?')) {
            fetch(`/api/news/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                showNewsAndLoad();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al borrar la noticia.');
            });
        }
    }

    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitEdit();
    });

    

    function submitEdit() {
        const id = editForm['edit-id'].value;
        const formData = new FormData();
        formData.append('title', editForm['edit-title'].value);
        formData.append('content', editForm['edit-content'].value);
        formData.append('body', editForm['edit-body'].value);
        formData.append('newsDate', editForm['edit-newsDate'].value);
        formData.append('newsImage', document.getElementById('edit-newsImage').files[0]);  
    
        fetch(`/api/news/update/${id}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editNewsForm.style.display = 'none';
            showNewsAndLoad();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al actualizar la noticia.');
        });
    }
    
    

    loadNews();
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const addNewsForm = document.querySelector('.form-container');
    const editNewsForm = document.getElementById('edit-news-form');
    const newsList = document.getElementById('news-list');
    const switchLabel = document.getElementById('switchLabel');

    toggleFormBtn.addEventListener('change', function() {
        // Si el interruptor se activa mientras el formulario de edición está visible
        if (this.checked && editNewsForm.style.display !== 'none') {
            alert('¡No puedes regresar a ver las demás noticias sin haber terminado de editar la actual!');
            this.checked = false; // Desactiva el interruptor para mantener el estado actual
        } else {
            // Comportamiento normal del interruptor si el formulario de edición no está visible
            if (this.checked) {
                if(editNewsForm.style.display === 'none') {
                    addNewsForm.style.display = 'block';
                    switchLabel.textContent = 'Agregar noticias';
                }
                newsList.style.display = 'none';
            } else {
                if(editNewsForm.style.display === 'none') {
                    addNewsForm.style.display = 'none';
                    newsList.style.display = 'block';
                    switchLabel.textContent = 'Editar noticias';
                }
            }
        }
    });

    // Configuración inicial al cargar la página
    if(editNewsForm.style.display === 'none') {
        addNewsForm.style.display = 'block';
        newsList.style.display = 'none';
        toggleFormBtn.checked = true;
        switchLabel.textContent = 'Agregar noticias';
    } else {
        addNewsForm.style.display = 'none';
        newsList.style.display = 'none';
        toggleFormBtn.checked = false;
        switchLabel.textContent = 'Editar';
    }
});

