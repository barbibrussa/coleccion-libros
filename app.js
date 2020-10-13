//Definición de las clases 
class Libro {
    constructor(titulo, autor, isbn){
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class UI {
    //Esto se va a llamar cuando se cargue la pagina
    static mostrarLibros(){
        //le consulta a la clase datos y trae lo que hay en el localStorage y lo devuelve como un arreglo
        const libros = Datos.traerLibros();
        //recorrer el arreglo y le envío a la funcion, le envio el libro que es un elemento del arreglo y le envio como parametro al otro metodo agregarLibroLista
        libros.forEach((libro) => UI.agregarLibroLista(libro));
    }

    static agregarLibroLista(libro){
        const lista = document.querySelector('#libro-list');
        //crear una fila en la tabla que tiene el cuerpo con el objeto libro-list
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        
        lista.appendChild(fila);
    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            //el elemento sería el enlace (<a href="#" class="btn btn-danger btn-sm delete">), el elemento padre de esto es el td, y el padre de este es la fila tr, entonces así se borra toda la fila
            el.parentElement.parentElement.remove()
        }
    }
    //alerta de que los campos no están completos 
    static mostrarAlerta(mensaje, className){ 
        //el mensaje va a aparecer dentro de un div y en una posicion 
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        //esto es para decirle donde aparecer, por eso primero creo variables seleccionando esos objetos del html y desp le digo que se ponga antes de los mismos
        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');

        container.insertBefore(div, form);

        setTimeout(()=> document.querySelector('.alert').remove(), 3000) //para que se muestre unos segundos y desp lo remueva
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';

    }
}

class Datos {
    static traerLibros(){ //consulta al localstorage si existen libros y si hay los trae
        let libros;
        //validar si hay libros, si está vacio devuelve un arreglo vacio, sino libros es un arreglo con elementos dentro
        if(localStorage.getItem('libros') === null){
            libros = []
        }else {
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static agregarLibro(libro){
        //traer un arreglo dle localStorage, le agrego el nuevo libro, y nuevamente guardarlo en el local storage
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn){
        //traigo los libros y los guardo en un arreglo llamado libros
        const libros = Datos.traerLibros();
        //recorro el arreglo y creo una función flecha del tipo anonima y le envio como patamentro el libro y el indice
        libros.forEach((libro, index) => {
            //pregunto si en el elemento dle arreglo, el campo isbn es igual al isbn que estoy recibiendo como parametro y si es así que lo elimine. Lo elimina del arreglo
            if(libro.isbn === isbn){
                libros.splice(index, 1);
            }
        });
        //como lo elimina del arreglo le mando el nuevo arreglo con el elemento eliminado
        localStorage.setItem('libros', JSON.stringify(libros));
    }
}

//Carga de la pagina
document.addEventListener('DOMContentLoaded',UI.mostrarLibros());

//Controlar el evento submit
document.querySelector('#libro-form').addEventListener('submit', (e) => {
    e.preventDefault(); //para que no haya problema si se cancela 

    //Obtener los valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    //Validar que todos los campos estén ingresados
    if(titulo === '' || autor === '' || isbn === ''){
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'danger');
    }
    if(titulo === '' && autor === ''){
        UI.mostrarAlerta('Por favor ingrese el título y el autor', 'danger');
    }
    if(titulo === '' && isbn === ''){
        UI.mostrarAlerta('Por favor ingrese el título y el #ISBN', 'danger');
    }
    if(titulo === ''){
        UI.mostrarAlerta('Por favor ingrese el título', 'danger');
    } else {
        //creo mi objeto libro
        const libro = new Libro(titulo, autor, isbn);
        //agregar el objeto libro a los datos
        Datos.agregarLibro(libro);
        //agregar el objeto libro a la lista debajo
        UI.agregarLibroLista(libro);
        //Mostrar un mensaje que diga que se agregó el libro
        UI.mostrarAlerta('Libro agregado a la coleccion', 'success');
        //luego de agregarlo que se limpien los campos
        UI.limpiarCampos();
    }
});

document.querySelector('#libro-list').addEventListener('click', (e) => {
    UI.eliminarLibro(e.target);
    //e.target es el botoncito con la X, ahi va a ir al elemento padre es el td, pero el previo elemento de ese es el isbn, entonces le pido que de ese elemento me devuelva ese texto que tiene ahí dentro. Uso esto porque el isbn es un código único del libro entonces lo puedo reconocer con eso para eliminarlo por el LocalStorage
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Libro eliminado', 'success');
});

function validar(titulo, autor, isbn){
    if(titulo === '' || autor === '' || isbn === ''){
        return 'Por favor ingrese todos los datos'
    }
    if(titulo === '' && autor === ''){
        return 'Por favor ingrese el título y el autor';
    }
    if(titulo === '' && isbn === ''){
        return 'Por favor ingrese el título y el #ISBN';
    }
    if(titulo === ''){
        return 'Por favor ingrese el título';
    }
}