

import {Button} from './Button' // Se importa el botón que vamos a usar en este component

export const Keyboard = ({onClickBtn}) =>{ //se crea la función a exportar que recibe como parametro un onclick que se gestionará en el padre Calculator

   const buttons = [ //se crea un array con los elementos de los botones
      'C', 'Del', '/', '*',
      '7', '8','9','+',
      '6','5','4','-',
      '3','2','1','.',
      '0','='
   ]

   const renderBtn = () => { //Se crea una funcion para renderizar los botones
      return buttons.map((btn)=> (//Se recotte el array de los botones creando la variable btn con el valor de cada elemento de arr
         <Button  //Se llama al elemento hijo para asignarle un valor a cada elemento 
            key = {btn} //aunque no lo tiene como prop, key es imprescindible para identificar cada boton
            content = {btn} //se le pasa la prop content con el contenido del span de cada boton
            onClick = {onClickBtn} //al onClick del boton se le pasa la prop del padre 
         />
      ))
   }

   return (
      <div className = 'keyboard'> {/* Se devuelve un div con una clasname que incluirá */}
         {renderBtn()} {/* Una llamada a la función para que se cree el keyboard */}
      </div>
   )

}