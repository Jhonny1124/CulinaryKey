async function getdata(url) {
  //Funcion para consultar la API
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data.meals;
    } catch (error) {
      console.error(`fallo la consulta a la api: ${error}`);
    }
}

const contenido = document.getElementById("contenido"); //contenido dinamico de la pagina

const busquedad = document.getElementById("busquedad");
const filtrado = document.getElementById("filtros");
const opciones = document.getElementsByClassName("opciones-filtro");

let matriz = document.createElement("div"); //Tarjetas de los platos con imagen y nombre
matriz.classList.add("productos");

let PaginasMostradas = document.createElement("div"); //Pagina que muestra 18 elementos por busquedad
PaginasMostradas.style.justifyContent = "center";
PaginasMostradas.style.textAlign = "center";

let matrizcategorias = document.createElement("div");//Categorias de busquedad
matrizcategorias.classList.add("productos");

let matrizpopulares = document.createElement("div");//Ingredientes mas populares
matrizpopulares.classList.add("productospopu");

let iniciopagina = document.createElement("div");//Mostrar ingredientes populares y categorias al incio de la pagina

let plato = document.createElement("div");

let apiurl;
let datos;
let nombre_plato;

let populares = { //Lista de ingredientes populares
  data: [
    {
        nombre:"Chicken",
        url:"https://www.themealdb.com/images/ingredients/Chicken.png",
    },
    {
      nombre:"Beef",
      url:"https://www.themealdb.com/images/ingredients/Beef.png",
    },
    {
      nombre:"Pork",
      url:"https://www.themealdb.com/images/ingredients/Pork.png",
    },
    {
      nombre:"Salmon",
      url:"https://www.themealdb.com/images/ingredients/Salmon.png",
    },
  ],
};
function tipoFiltro(valor){//Funcion que determina los links dpendiendo del tipo de busquedad
  switch(valor){
      case 1:
          apiurl = "https://themealdb.com/api/json/v1/1/search.php?s=";
          break;
      case 2:
          apiurl = "https://themealdb.com/api/json/v1/1/filter.php?i=";
          break;
      case 3:
          apiurl = "https://themealdb.com/api/json/v1/1/filter.php?c=";
          break;
      case 4:
          apiurl = "https://themealdb.com/api/json/v1/1/filter.php?a=";
          break;
  }
};
//Eventos que permiten un menu dinamico que muestra los filtros de busquedad
filtrado.addEventListener("click",function(){
  filtrado.style.transition = "opacity 1s ease-in-out";
  filtrado.style.opacity = "0";
  filtrado.style.visibility = "hidden";
  for(let value of opciones){
    value.style.transition = "opacity 1s ease-in-out";
      value.style.opacity="1";
      value.style.visibility="visible";
  }
});
for(let opcion of opciones){
  opcion.addEventListener("click", function(){
    filtrado.style.transition = "opacity 1s ease-in-out";
    filtrado.style.opacity = "1";
    filtrado.style.visibility = "visible";
      for(let value of opciones){
        value.style.transition = "opacity 1s ease-in-out";
        value.style.opacity="0";
        value.style.visibility="hidden";
      }
    });
}
function seleccionFiltro(significado){//funcion que deja señalado el fltro que se va a utilizar
  for(let value of opciones){
      if(significado.toUpperCase() == value.innerText.toUpperCase()){
          value.classList.add("activo");
          console.log(significado);
          let prueba = value.innerText.split(" ");
          document.getElementById("barra").placeholder = "Enter "+prueba[prueba.length -1];
      }
      else{
          value.classList.remove("activo");
      }
  }
}
function VerificacionEnter(evento){//Funcion que permite hacer busquedad con enter
  if(evento.keyCode === 13){
    buscar();
  }
}
function productos(datos) {//Funcion que crea tarjetas para los platos
  plato.innerHTML = "";
  matriz.innerHTML = "";
  iniciopagina.innerHTML = "";
  PaginasMostradas.innerHTML = "";

  // Determinar el número total de páginas
  const totalPaginas = Math.ceil(datos.length / 18);

  // Función para mostrar una página específica
  function mostrarPagina(pagina) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    matriz.innerHTML = ""; // Limpiar el contenido actual de la matriz
    const inicio = pagina * 18;
    const fin = Math.min(inicio + 18, datos.length);

    for (let i = inicio; i < fin; i++) {
      const dato = datos[i];

      let tarjeta = document.createElement("a");
      tarjeta.classList.add("tarjeta");
      tarjeta.addEventListener("click", function(){
        info_producto(tarjeta);
      });

      let nombre= document.createElement("p");
      nombre.textContent = dato.strMeal;
      nombre.classList.add("prueba");

      let imagen = document.createElement("img");
      imagen.classList.add("imagen-tarjeta");
      imagen.src = dato.strMealThumb;
      imagen.alt = dato.strMeal;

      tarjeta.addEventListener("mouseenter", function(){
        nombre.style.fontSize = "min(3.5vw, 37px)";
        nombre.style.transition = "font-size 0.4s ease"; 
        imagen.style.opacity = "0.65";
        imagen.style.transition = "opacity 0.4s ease"; 
      });
      tarjeta.addEventListener("mouseleave", function(){
        nombre.style.fontSize = "min(3vw, 33px)";
        nombre.style.transition = "font-size 0.4s ease"; 
        imagen.style.opacity = "0.75";
        imagen.style.transition = "opacity 0.4s ease"; 
      });

      tarjeta.appendChild(imagen);
      tarjeta.appendChild(nombre);

      matriz.appendChild(tarjeta);
    }
  }

  // Mostrar la primera página al cargar
  mostrarPagina(0);

  // Agregar botones para navegar entre las páginas
  PaginasMostradas.appendChild(matriz);
  for (let i = 0; i < totalPaginas; i++) {
    const boton = document.createElement("button");
    boton.classList.add("BotonPagina");
    boton.textContent = i + 1; // El índice de la página comienza desde 0
    boton.addEventListener("click", function() {
      mostrarPagina(i);
    });
    PaginasMostradas.appendChild(boton);
  }
  contenido.appendChild(PaginasMostradas);
}
async function Inicio(){//Funcion que crea el inicio de la pagina con los ingredientes populares y las categorias
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  plato.innerHTML = "";
  PaginasMostradas.innerHTML = "";
  matrizcategorias.innerHTML = "";
  matrizpopulares.innerHTML = "";
  iniciopagina.innerHTML = "";

  let ingredientespopu = document.createElement("h2");
  ingredientespopu.textContent="Popular Ingredients"
  ingredientespopu.classList.add("encabezado2");
  let categorias = document.createElement("h2");
  categorias.textContent="Categories"
  categorias.classList.add("encabezado2")

  for(let dato of populares.data){
    let tarjeta = document.createElement("a");
    tarjeta.classList.add("tarjetapopu");
    tarjeta.addEventListener("click", function(){
      busquedad_ingredientes(tarjeta);
    })

    let nombre = document.createElement("p");
    nombre.textContent = dato.nombre;
    nombre.classList.add("prueba");

    let imagen = document.createElement("img");
    imagen.classList.add("imagen-tarjeta");
    imagen.src = dato.url;
    imagen.alt = dato.nombre;

    tarjeta.addEventListener("mouseenter", function(){
      nombre.style.fontSize = "min(3.5vw, 37px)";
      nombre.style.transition = "font-size 0.4s ease"; 
      imagen.style.opacity = "0.65";
      imagen.style.transition = "opacity 0.4s ease"; 
    })
    tarjeta.addEventListener("mouseleave", function(){
      nombre.style.fontSize = "min(3vw, 33px)";
      nombre.style.transition = "font-size 0.4s ease"; 
      imagen.style.opacity = "0.75";
      imagen.style.transition = "opacity 0.4s ease"; 
    })

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(nombre);

    matrizpopulares.appendChild(tarjeta);
  }
  iniciopagina.appendChild(ingredientespopu);
  iniciopagina.appendChild(matrizpopulares);
  iniciopagina.appendChild(categorias);
  try{
    let respuestacat = await axios.get("https://www.themealdb.com/api/json/v1/1/categories.php");
    for(let categoria of respuestacat.data.categories){
      let tarjeta = document.createElement("a");
      tarjeta.classList.add("tarjeta");
      tarjeta.addEventListener("click", function(){
        busquedad_categoria(tarjeta);
      })

      let nombre = document.createElement("p");
      nombre.textContent = categoria.strCategory;
      nombre.classList.add("prueba");

      let imagen = document.createElement("img");
      imagen.classList.add("imagen-tarjeta");
      imagen.src = categoria.strCategoryThumb;
      imagen.alt = categoria.strCategory;

      tarjeta.addEventListener("mouseenter", function(){
        nombre.style.fontSize = "min(3.5vw, 37px)";
        nombre.style.transition = "font-size 0.4s ease"; 
        imagen.style.opacity = "0.65";
        imagen.style.transition = "opacity 0.4s ease"; 
      })
      tarjeta.addEventListener("mouseleave", function(){
        nombre.style.fontSize = "min(3vw, 33px)";
        nombre.style.transition = "font-size 0.4s ease"; 
        imagen.style.opacity = "0.75";
        imagen.style.transition = "opacity 0.4s ease"; 
      })

      tarjeta.appendChild(imagen);
      tarjeta.appendChild(nombre);

      matrizcategorias.appendChild(tarjeta);
    }
  }
  catch(error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
  iniciopagina.appendChild(matrizcategorias);
  contenido.appendChild(iniciopagina);
  busquedad.style.display = "flex";
}
async function buscar(){//Funcion que evalua si la busquedad esta correcta y la ejecuta
  const entrada = document.getElementById("barra");
  if(entrada.value == "" || /^\s+$/.test(entrada.value) == true){
    entrada.value = "";
    Swal.fire({
      title: 'Error',
      text: 'Por favor, ingresa un valor válido.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
  else{
    const url = apiurl+entrada.value;
    try{
      const respuesta = await getdata(url);
      if(respuesta == null){
        entrada.value = "";
        Swal.fire({
          title: 'Sin resultados',
          text: 'Lo sentimos, no se encontraron resultados para la búsqueda',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
      else{
        entrada.value = "";
        productos(respuesta);
      }
    }
    catch(error){
      console.error(`fallo la consulta a la api: ${error}`);
    }
  }
}
async function busquedad_ingredientes(tarjeta){//Funcion que hace busquedad por Ingredientes Populares
  const ingrediente = tarjeta.querySelector("p").textContent;
  const url = "https://themealdb.com/api/json/v1/1/filter.php?i="+ingrediente;
  try{
    const respuesta = await getdata(url);
    productos(respuesta);
  }
  catch (error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
async function busquedad_categoria(tarjeta){//Funcion que hace busquedad por cotegoria
  const ingrediente = tarjeta.querySelector("p").textContent;
  const url = "https://themealdb.com/api/json/v1/1/filter.php?c="+ingrediente;
  try{
    const respuesta = await getdata(url);
    productos(respuesta);
  }
  catch (error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
async function info_producto(tarjeta){//Funcion que muestra toda la informacion del plato (Imagen, Nombre, Ingredientes y Instrucciones)
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  PaginasMostradas.innerHTML = "";
  iniciopagina.innerHTML = "";
  busquedad.style.display = "none";
  let ImagenPlatoDisplay = document.createElement("div");
  ImagenPlatoDisplay.classList.add("ImagenPlatoDislay");

  const NombrePlato = document.createElement("h2");
  NombrePlato.textContent = tarjeta.querySelector("p").textContent;
  NombrePlato.classList.add("encabezado2")

  const url = "https://themealdb.com/api/json/v1/1/search.php?s="+NombrePlato.textContent;

  ImagenPlatoDisplay.appendChild(NombrePlato);

  try{
    const respuesta = await getdata(url);

    let imagen = document.createElement("img");
    imagen.classList.add("ImagenPlato");
    imagen.src = respuesta[0].strMealThumb;
    imagen.alt = NombrePlato;

    ImagenPlatoDisplay.appendChild(imagen);

    let IngredientesInstrucciones = document.createElement("div");
    IngredientesInstrucciones.classList.add("IngredientesInstrucciones");

    let ingredientes = document.createElement("div");
    ingredientes.classList.add("IngredientesPlato");
    for(let i = 1; i <= 20; i++){
      let ingrediente = respuesta[0]['strIngredient' + i];
      if(ingrediente !== "" & ingrediente !== null){
        let TarjetaIngrediente = document.createElement("div");
        TarjetaIngrediente.classList.add("tarjeta");
        TarjetaIngrediente.addEventListener("mouseenter", function(){
          TarjetaIngrediente.style.cursor = "default"
        })

        let NombreIngrediente = document.createElement("p");
        NombreIngrediente.textContent = ingrediente;
        NombreIngrediente.classList.add("NombreIngrediente");

        let ImagenIngrediente = document.createElement("img");
        ImagenIngrediente.classList.add("imagen-tarjeta");
        ImagenIngrediente.src = "https://www.themealdb.com/images/ingredients/"+ingrediente+".png";
        ImagenIngrediente.alt = ingrediente

        TarjetaIngrediente.appendChild(ImagenIngrediente);
        TarjetaIngrediente.appendChild(NombreIngrediente);

        ingredientes.appendChild(TarjetaIngrediente);
      }
    }

    let Contenedor = document.createElement("div");
    
    let Encabezado = document.createElement("h2");
    Encabezado.textContent = "Instructions";
    Encabezado.classList.add("encabezado2");

    Contenedor.appendChild(Encabezado);

    let instrucciones = document.createElement("p");
    instrucciones.classList.add("Instrucciones");
    instrucciones.textContent = respuesta[0].strInstructions;

    Contenedor.appendChild(instrucciones);

    plato.appendChild(ImagenPlatoDisplay);
    IngredientesInstrucciones.appendChild(ingredientes);
    IngredientesInstrucciones.appendChild(Contenedor);
    plato.appendChild(IngredientesInstrucciones);
    contenido.appendChild(plato);
    
  }
  catch(error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
window.onload = () =>{//Funcion que inicializa la pagina
  Inicio();
  tipoFiltro(1)
  seleccionFiltro('By Name')
  for(let value of opciones){
    value.style.opacity="0";
    value.style.visibility="hidden";
  }
}