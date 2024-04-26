async function getdata(url) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data.meals;
    } catch (error) {
      console.error(`fallo la consulta a la api: ${error}`);
    }
}
(async() => {
  try{
      const prueba = await getdata('http://www.themealdb.com/api/json/v1/1/search.php?s=Strawberries Romanoff');
      console.log(prueba);
      console.log(prueba[0].strArea);
  }
  catch(error){
      console.error(`fallo la consulta a la api: ${error}`);
  }
})();
const filtrado = document.getElementById("filtros");
const opciones = document.getElementsByClassName("opciones-filtro");
let apiurl;
function tipoFiltro(valor){
  switch(valor){
      case 1:
          apiurl = "http://www.themealdb.com/api/json/v1/1/search.php?s=";
          break;
      case 2:
          apiurl = "http://www.themealdb.com/api/json/v1/1/filter.php?i=";
          break;
      case 3:
          apiurl = "http://www.themealdb.com/api/json/v1/1/filter.php?c=";
          break;
      case 4:
          apiurl = "http://www.themealdb.com/api/json/v1/1/filter.php?a=";
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
async function buscar(){
  const entrada = document.getElementById("barra").value;
  const prueba = await getdata(apiurl+entrada);
  console.log(prueba)
}
window.onload = () =>{
  console.log("hola");
  tipoFiltro(1)
  seleccionFiltro('Por Nombre')
  for(let value of opciones){
    value.style.opacity="0";
    value.style.visibility="hidden";
  }
}