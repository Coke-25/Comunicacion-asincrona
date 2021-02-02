<?php
//Conectamos a la base de datos
$conexion = mysqli_connect('localhost', 'root', 'Studium2020;', 'ajax');

if(!$conexion){
    echo "Error de conexión";
} else {
    //Para insertar 
    if(isset($_POST['idPokemon'])&&isset($_POST['nombrePokemon'])){
        $sql = "insert into seleccion (idPokemon, nombrePokemon) values ('".$_POST['idPokemon']."', '".$_POST['nombrePokemon']."');";
        //Select para comprobar si esta ya en la BD
        $selectSQL = "select idPokemon from seleccion where idPokemon=".$_POST['idPokemon'].";";
        $resultado = $conexion->query($selectSQL);
        //Si devuelve más de un resultado es que ya existe
        if(($resultado->num_rows)>0){
            echo "AlertExist";
        }
        //Si no existe se añade a la BD
        else if ($conexion->query($sql) === true) {
            echo "AlertOK";
        } else {
            echo "No se ha podido seleccionar";
        }
    //Para mostrar los pokemon de la base de datos    
    } else if(isset($_GET['buscar'])){
        $selectSQL = "select idPokemon, nombrePokemon from seleccion;";
        $resultado = $conexion->query($selectSQL);
        while($row = $resultado->fetch_assoc()){
            echo "<tr>";
            echo "<td>".$row['idPokemon']."</td>";
            echo "<td>".$row['nombrePokemon']."</td>";
            echo "<td><button class='btn btn-danger' onclick='borrar(".$row['idPokemon'].")'>Borrar</button></td>";
            echo "</tr>";
        }
    //Para borrar pokemon
    } else if(isset($_POST['idPokemon'])){
        $deleteSQL = "delete from seleccion where idPokemon=".$_POST['idPokemon'].";";
        $conexion->query($deleteSQL);
        $resultado = $conexion->affected_rows;
        if($resultado>0){
            echo "deleteOK";
        } else {
            echo "deleteFail";
        }
    }
}

$conexion->close();