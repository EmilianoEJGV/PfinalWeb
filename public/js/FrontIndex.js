document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('main');
    const acutalPage = document.getElementById('actual-page');
    let allNews = []; // Arreglo para guardar las noticas
    let newsPerPage = 4;  // Número de noticias por página
    let totalNews = 0;  // Número total de noticia
    let auxArray = [];  // Arreglo de noticas auxiiar
    let index = 0; // Página actual


    fetch('/api/news')
        .then(response => response.json())
        .then(data => {

            try {
                // Se obtiene el númeto total de páginas mediante la cantidad total de noticias
                totalPages = Math.round(data.length / newsPerPage);

                while (totalNews < data.length) {  // Ciclo principal 
                    auxArray = [];  // Se limpia el array auxiliar
                    for (let i = 0; i < newsPerPage; i++) {  // Se coloca el número especificado de noticas por página
                        if (totalNews < data.length) {  // Si aún existen noticias
                            auxArray.push(data[totalNews]);
                            totalNews += 1;
                        } else {  // De lo contrario
                            break;
                        }

                    }
                    allNews.push(auxArray); // Se agrega el arreglo auxiliar al principal de noticias
                }
                console.log(allNews);

            } catch (e) {
                console.log(`Se produjo un error insesperado: ${e}`);
                allNews = [];  // Se declara un arreglo vacío de noticias
                totalNews = 0;  // No coloca en 0 el número total de noticias
                totalPages = 0;  // Se coloca en 0 en número total de páginas
            }



            // Función para acutarlizar las noticas de la página correspondiente
            function updatePage(arrayNews) {

                // Seleccionar y eliminar todos los elementos creados previamente
                const existingCards = document.querySelectorAll('.contenedor');
                existingCards.forEach(card => card.remove());

                const existingCardsExtended = document.querySelectorAll('.contenedor-alterado');
                existingCardsExtended.forEach(card => card.remove());

                // Crear los nuevos elementos
                for (let news of arrayNews) {
                    const container_card = document.createElement('div');
                    container_card.className = 'contenedor';

                    const card = document.createElement('div');
                    card.className = 'news-card';
                    card.innerHTML = `
               <div class="image-container">
                <img src="${news.imageUrl}" alt="Imagen de la noticia">
              </div>
                <div>
                <h2 class = "logo lato-regular-italic">${news.title}</h2>
                <p class="hover_content h6 lato-regular">Fecha: ${news.newsDate}</p>
                <p class="hover_content h6 lato-regular">${news.content.substring(0, 100)}...</p>
                <p class="hover_description h6">${news.body}</p>
                <button class="button" id="show-more">
                    <span class="button_lg">
                        <span class="button_sl"></span>
                        <span class="button_text">Ver más</span>
                    </span>
                </button>
               </div>
            `;
                    container_card.appendChild(card);

                    container.appendChild(container_card);
                }

                buttonsFunctionality();
            }



            if (allNews.length > 0) updatePage(allNews[index]);
            console.log(`Usted está en la página: ${index + 1}`);
            acutalPage.textContent = `Página: ${index + 1}/${totalPages}`;

            const btnAfter = document.getElementById('after');
            const btnBefore = document.getElementById('before');

            btnAfter.addEventListener('click', () => {
                if (index + 1 < allNews.length) {
                    index += 1;
                    updatePage(allNews[index]);
                    console.log(`Usted está en la página: ${index + 1}`);
                    acutalPage.textContent = `Página: ${index + 1}/${totalPages}`;
                } else {
                    console.log("Ya no hay más páginas");
                    console.log(`Usted está en la página: ${index + 1}`);
                }
            });

            btnBefore.addEventListener('click', () => {
                if (index - 1 >= 0) {
                    index -= 1;
                    updatePage(allNews[index]);
                    console.log(`Usted está en la página: ${index + 1}`);
                    acutalPage.textContent = `Página: ${index + 1}/${totalPages}`;
                } else {
                    console.log("Ya no hay más páginas");
                    console.log(`Usted está en la página: ${index + 1}`);
                }
            });


            function manageButtons(condition){
                const controlButtons = document.querySelector('.control-buttons');
                if(condition){
                    controlButtons.style.display = 'flex';
                }else{
                    controlButtons.style.display = 'none';
                }
            }


            // Función para la funcionalidad de elementos buttons de las tarjetas
            function buttonsFunctionality() {
                // Para la funcionalidad de las tarjetas de noticias
                const btns = document.querySelectorAll("#show-more")  // Se adquiere a los botones de cada una de las tarjetas creadas
                const hoverDescription = document.querySelector('.hover_description');  // Se adquiere la descripción de cada una de las tarjetas creadas
                const containerCards = document.querySelectorAll('.contenedor');
                

                for (let button of btns) {
                    const buttonText = button.querySelector('.button_text');  // Se accede al texto del elemento button
                    const containerCard = button.closest('.contenedor');  // Se accede al contenedor de la tarjeta que se seleccione
                    const card = containerCard.querySelector('.news-card');  // Se accede al contenido de la tarjeta seleccionada
                    const hoverDescription = card.querySelector('.hover_description');  // Se accede a la descripción de la tarjeta seleccionada

                    button.addEventListener('click', () => {  // Se le agrega un evento a los elementos buttons

                        console.log(buttonText.textContent);
                        if (buttonText.textContent === 'Ver más') {  // Si se selecciona una noticia

                            manageButtons(false);

                            buttonText.textContent = 'Ver menos';

                            for (let container of containerCards) {
                                if (container !== containerCard) {
                                    container.style.display = 'none';
                                } else {
                                    containerCard.classList.replace('contenedor', 'contenedor-alterado');
                                    hoverDescription.style.maxHeight = '70rem';
                                    hoverDescription.style.transform = 'none';
                                }
                            }
                        } else {  // Si se desea volver a ver las demás noticias

                            manageButtons(true);

                            buttonText.textContent = 'Ver más';
                            for (let container of containerCards) {
                                if (container !== containerCard) {
                                    container.style.display = 'flex';
                                } else {
                                    containerCard.classList.replace('contenedor-alterado', 'contenedor');
                                    hoverDescription.style.maxHeight = '0';
                                    hoverDescription.style.transform = 'translateY(1em)';
                                }
                            }
                        }

                    });
                }

            }




            // Se seleccionan los elementos de la barra de búsqueda para poder modificarlos o adaptarlos
            const searchBar = document.getElementById('search-bar');
            const searchButton = document.getElementById('search-button');
            const searchResults = document.getElementById('search-results');

            searchBar.addEventListener('input', async () => {
                const query = searchBar.value.trim().toLowerCase();  // Se toma el contenido de la barra de búsqueda y se convierte a minúsculas todo
                //console.log(findTitle(query));
                searchResults.innerHTML = '';  // Se limpia la barra de búsqueda

                if (query) {  // Si se tiene una cadena válida
                    // Se buscan los resultados que contengan la cadena búscada
                    //const filteredResults = previousSearches.filter(item => item.toLowerCase().includes(query));
                    const filteredResults = await findTitle(query);
                    console.log(`Resultado:`, filteredResults);


                    if (filteredResults.length > 0) {  // Si se han encotrado coincidencias
                        searchResults.style.display = 'block';  // Se ajusta el contenedor
                        filteredResults.forEach(result => {  // Se recorre el arreglo de las coincidencias encontradas
                            const li = document.createElement('li');
                            li.textContent = result; // Se colocan todas las cadenas similares en el contenedor de resúltados
                            li.addEventListener('click', () => {  // Si se selecciona una cadena
                                searchBar.value = result;  // Se coloca en la barra de búsqueda
                                searchResults.style.display = 'none';  // Se eliminan las demás
                            });
                            searchResults.appendChild(li);
                        });
                    } else {
                        searchResults.style.display = 'none';
                    }
                } else {
                    searchResults.style.display = 'none';
                }
            });

            // Se añade un evento al elemento button para saber cuándo buscar algo
            searchButton.addEventListener('click', () => {
                //alert('Buscar: ' + searchBar.value);
                if (searchBar.value !== '' && searchBar.value !== ' ') {
                    title = searchBar.value.trim().toLowerCase();
                
                    for(let i = 0; i < allNews.length; i++){
                        for(let newsTitle of allNews[i]){
                            if(newsTitle.title.toLowerCase() === title){
                                index = i;
                                updatePage(allNews[i]);
                                acutalPage.textContent = `Página: ${index + 1}/${totalPages}`;
                                manageButtons(true);
                            }
                        }
                    }

                }




            });

            // Si se da click en un área fuera de la barrá de búsqueda o de las coincidencias encontradas
            document.addEventListener('click', (event) => {
                if (!searchBar.contains(event.target) && !searchButton.contains(event.target) && !searchResults.contains(event.target)) {
                    searchResults.style.display = 'none';  // Se ocultan las coincidencias encontradas
                }
            });

        })
        .catch(error => console.error('Error fetching news:', error));

});


function findTitle(str) {
    return new Promise((resolve, reject) => {
        let titles = [];

        fetch(`/api/news`)
            .then(response => response.json())
            .then(data => {
                for (let newTitle of Object.values(data)) {
                    titles.push(newTitle.title);
                }

                let matches = titles.filter(item => item.toLowerCase().includes(str.toLowerCase()));

                console.log('Coincidencias finales:', matches);

                resolve(matches); // Resuelve la Promesa con las coincidencias encontradas
            })
            .catch(error => {
                console.error('Error al buscar:', error);
                reject(error); // Rechaza la Promesa con el error
            });
    });
}


