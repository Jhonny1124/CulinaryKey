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
        const prueba = await getdata('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata');
        console.log(prueba);
        console.log(prueba[0].strArea);
    }
    catch(error){
        console.error(`fallo la consulta a la api: ${error}`);
    }
  })();

  const filtrado = document.getElementById("filtros");
  const opciones = document.getElementsByClassName("opciones-filtro")
  //console.log(opciones);
  filtrado.addEventListener("click",function(){
    filtrado.classList.add("esconder");
    for(let value of opciones){
        console.log(value);
        value.classList.add("mostrar");
    }
  });