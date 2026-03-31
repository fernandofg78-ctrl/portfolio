

//Este componente vamos a crear el esqueleto de un boton, que tiene que recibir de su componente padre dos elementos. el textContent y el evneto onclick
export const Button = ({content, onClick}) =>{   // lo primero, declaramos la funcion con los props que va a recibir
   const handleClick = ()=>{  //Se crea una funcion para gestionar el onclick, pasádole el valor del botón, que vendrá del padre
      onClick(content) // Se devuelve el onclick con el valor

   }

   const classes = [  //creo una variable para pasarsela como prop a el nombre de las clases de los botones, ya que algunos tendrán más de 1
      "btn",  //todos son clase btn
      content === "0" ? "zero" : "", //el 0 tendrá clase zero...
      content === "=" ? "equal" : "",
      ["+", "-", "*", "/"].includes(content) ? "operator" : "", //los operadores clase operador
      content === "C" ? "clear" : "",
   ].filter(Boolean).join(" "); // filter Boolean elimina espacios vacios ya que al crearse clases, se crean espacios vacios en el array de clases donde no coresponde crear nada. join une en una sola cadena 


   return (
      <button className={classes} onClick={handleClick}> {/* PAsamos el nombre de clase como una prop */}
         <span>{content}</span>
      </button>
   )

}