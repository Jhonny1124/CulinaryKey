async function getdata(url) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data.meals;
    } catch (error) {
      console.error(`fallo la consulta a la api: ${error}`);
    }
}

const contenido = document.getElementById("contenido");

const busquedad = document.getElementById("busquedad");
const filtrado = document.getElementById("filtros");
const opciones = document.getElementsByClassName("opciones-filtro");

let matriz = document.createElement("div");
matriz.classList.add("productos");

let matrizcategorias = document.createElement("div");
matrizcategorias.classList.add("productos");

let matrizpopulares = document.createElement("div");
matrizpopulares.classList.add("productospopu");

let iniciopagina = document.createElement("div");

let plato = document.createElement("div");

let apiurl;
let datos;
let nombre_plato;

let populares = {
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
function tipoFiltro(valor){
  switch(valor){
      case 1:
          apiurl = "http://themealdb.com/api/json/v1/1/search.php?s=";
          break;
      case 2:
          apiurl = "http://themealdb.com/api/json/v1/1/filter.php?i=";
          break;
      case 3:
          apiurl = "http://themealdb.com/api/json/v1/1/filter.php?c=";
          break;
      case 4:
          apiurl = "http://themealdb.com/api/json/v1/1/filter.php?a=";
          break;
  }
  console.log(valor)
};
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
function seleccionFiltro(significado){
  for(let value of opciones){
      if(significado.toUpperCase() == value.innerText.toUpperCase()){
          value.classList.add("activo");
          console.log(significado);
          let prueba = value.innerText.split(" ");
          document.getElementById("barra").placeholder = "Ingrese "+prueba[prueba.length -1];
      }
      else{
          value.classList.remove("activo");
      }
  }
}
function VerificacionEnter(evento){
  if(evento.keyCode === 13){
    buscar();
  }
}
function productos(datos){
  plato.innerHTML = "";
  matriz.innerHTML = "";
  iniciopagina.innerHTML = "";
  for(let dato of datos){
    
    let tarjeta = document.createElement("a");
    tarjeta.classList.add("tarjeta");
    tarjeta.addEventListener("click", function(){
      info_producto(tarjeta);
    })
    

    let nombre= document.createElement("p");
    nombre.textContent = dato.strMeal;
    nombre.classList.add("prueba");

    let imagen = document.createElement("img");
    imagen.classList.add("imagen-tarjeta");
    imagen.src = dato.strMealThumb;
    imagen.alt = dato.strMeal

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

    matriz.appendChild(tarjeta);
  }
  contenido.appendChild(matriz);
}
async function Inicio(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  plato.innerHTML = "";
  matriz.innerHTML = "";
  matrizcategorias.innerHTML = "";
  matrizpopulares.innerHTML = "";
  iniciopagina.innerHTML = "";

  let ingredientespopu = document.createElement("h2");
  ingredientespopu.textContent="Ingredientes Populares"
  ingredientespopu.classList.add("encabezado2");
  let categorias = document.createElement("h2");
  categorias.textContent="Categorias"
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
    let respuestacat = await axios.get("http://themealdb.com/api/json/v1/1/categories.php");
    console.log(respuestacat.data.categories);
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
async function buscar(){
  const entrada = document.getElementById("barra");
  if(entrada.value == "" || /^\s+$/.test(entrada.value) == true){
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
        Swal.fire({
          title: 'Sin resultados',
          text: 'Lo sentimos, no se encontraron resultados para la búsqueda',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
      else{
        entrada.value = "";
        console.log(datos)
        productos(respuesta);
      }
    }
    catch(error){
      console.error(`fallo la consulta a la api: ${error}`);
    }
  }
}
async function busquedad_ingredientes(tarjeta){
  const ingrediente = tarjeta.querySelector("p").textContent;
  const url = "http://themealdb.com/api/json/v1/1/filter.php?i="+ingrediente;
  try{
    const respuesta = await getdata(url);
    productos(respuesta);
  }
  catch (error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
async function busquedad_categoria(tarjeta){
  const ingrediente = tarjeta.querySelector("p").textContent;
  const url = "http://themealdb.com/api/json/v1/1/filter.php?c="+ingrediente;
  try{
    const respuesta = await getdata(url);
    productos(respuesta);
  }
  catch (error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
async function info_producto(tarjeta){
  matriz.innerHTML = "";
  iniciopagina.innerHTML = "";
  busquedad.style.display = "none";
  let ImagenPlatoDisplay = document.createElement("div");
  ImagenPlatoDisplay.classList.add("ImagenPlatoDislay");

  const NombrePlato = document.createElement("h2");
  NombrePlato.textContent = tarjeta.querySelector("p").textContent;
  NombrePlato.classList.add("encabezado2")

  const url = "http://themealdb.com/api/json/v1/1/search.php?s="+NombrePlato.textContent;

  ImagenPlatoDisplay.appendChild(NombrePlato);

  console.log(url)
  try{
    const respuesta = await getdata(url);

    console.log(respuesta)

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

    let instrucciones = document.createElement("p");
    instrucciones.classList.add("Instrucciones");
    instrucciones.textContent = respuesta[0].strInstructions;
    plato.appendChild(ImagenPlatoDisplay);
    IngredientesInstrucciones.appendChild(ingredientes);
    IngredientesInstrucciones.appendChild(instrucciones);
    plato.appendChild(IngredientesInstrucciones);
    contenido.appendChild(plato);
    
  }
  catch(error){
    console.error(`fallo la consulta a la api: ${error}`);
  }
}
window.onload = () =>{
  Inicio();
  console.log("hola");
  tipoFiltro(1)
  seleccionFiltro('Por Nombre')
  for(let value of opciones){
    value.style.opacity="0";
    value.style.visibility="hidden";
  }
}