$(window).on("load", function() {

    //Cargar JSON con JQuery
    $('#btnCargar').on('click', function(){
        let inputId = $('#formId').val();
        let inputName = $('#formName').val();
        
        $.getJSON("assets/json/pokedex.json", function(datos){
            $('#tabla').html(
                    $('<div>').attr('class','col-12').html(
                        $("<table>").attr('class','table table-dark table-striped').append(
                            $("<tr>").append(
                                $("<th>").text("ID"),
                                $("<th>").text("Nombre"),
                                $("<th>").text("Tipos"),
                                $("<th>").text("Opciones")))))
            
            $.each(datos, function(i, pokemon) {
                //Se pasa a minuscula tanto el nombre como lo introducido para realizar una busqueda correcta
                //Si lo introducido en el input forma parte del nombre se muestra
                let nombreMinuscula = pokemon.name.english.toLowerCase();
                if(nombreMinuscula.includes(inputName.toLowerCase())){
                //Se obtienen los valores y se separan por comas o se muestra solo el primero si no hay segundo
                let tipo1 = pokemon.type[0];
                let tipo2 = pokemon.type[1];
                let tipos = tipo1 + ", " + tipo2;
                if(tipo2==undefined){
                    tipos = tipo1;
                }


                $("<tr>")
                    .append(
                        $("<td>").attr('class','id'+i).text(pokemon.id),
                        $("<td>").attr('class','name'+i).text(pokemon.name.english),
                        $("<td>").text(tipos),
                        $("<td>").html($('<button>').attr('class','btn btn-warning').attr('onclick','seleccionar('+i+')').text("Seleccionar")))
                    .appendTo($("table"))
                }
                //Solo muestra los pokemon hasta el id indicado
                if(inputId==pokemon.id&&inputName==""){
                    return false;
                }
            })
        })
    });

    //Mostrar pokemon seleccionados con javascript
    let btnMostrar = document.getElementById('btnMostrar');
    //Función que se declara fuera para poderla utilizar al borrar un pokemon
    btnMostrar.addEventListener('click',mostrar);

    
    //Botón de las alertas para cerrarlas
    $('.close-btn').click(function(){
        $('.alert').removeClass("show");
        $('.alert').addClass("hide");
        $('.success').removeClass("show");
        $('.success').addClass("hide");
    });
});
//Se ejecuta cuando se selecciona un pokemon, se añade a la base de datos si no lo está y manda la alerta correspondiente
function seleccionar(row){
    $.post("assets/php/conexion.php", {idPokemon: $('.id'+row).text(), nombrePokemon: $('.name'+row).text()}, function(datos){
        if(datos=="AlertOK"){
            $('#msgSuccess').text("Seleccionado correctamente");
            $('.success').addClass("show");
            $('.success').removeClass("hide");
            $('.success').addClass("showAlert");
            setTimeout(function(){
                $('.success').removeClass("show");
                $('.success').addClass("hide");
            },5000);
        } else if(datos=="AlertExist"){
            $('.alert').addClass("show");
            $('.alert').removeClass("hide");
            $('.alert').addClass("showAlert");
            setTimeout(function(){
                $('.alert').removeClass("show");
                $('.alert').addClass("hide");
            },5000);
        } else {
            console.log(datos);
        }
    });
}
//Elimina el pokemon seleccionado de la base de datos
function borrar(pokemon){
    $.post("assets/php/conexion.php", {idPokemon: pokemon}, function(datos){
        if(datos=="deleteOK"){
            $('#msgSuccess').text("Pokemon eliminado de la lista");
            $('.success').addClass("show");
            $('.success').removeClass("hide");
            $('.success').addClass("showAlert");
            setTimeout(function(){
                $('.success').removeClass("show");
                $('.success').addClass("hide");
            },5000);
        } else {
            console.log(datos);
        }
        //Se vuelve a cargar la tabla para que no salga el eliminado
        mostrar();
    });
}

function mostrar(){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let respuesta = xhr.responseText;

            //Se localiza el div 'tabla'
            let divRow = document.getElementById('tabla');
            //Se crea un div para introducirlo dentro
            let divCol = document.createElement('div');
            divCol.setAttribute('class','col-12');
            //Se crea una tabla
            let tabla = document.createElement('table');
            tabla.setAttribute('class','table table-dark');
            tabla.innerHTML = "<thead><tr><th>ID</th><th>Nombre</th><th>Opciones</th></tr></thead>";
            //Se crea el tbody y se le rellena con el resultado dado por el archivo php
            let tbody = document.createElement('tbody');
            tbody.innerHTML = respuesta;

            //Se meten en su sitio
            tabla.append(tbody);
            divCol.append(tabla);
            divRow.replaceChild(divCol,divRow.childNodes[0])
        }
    }
    xhr.open('GET', "assets/php/conexion.php?buscar=true", true);
    xhr.send();
}
