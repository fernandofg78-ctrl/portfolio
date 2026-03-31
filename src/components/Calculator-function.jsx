import {Display} from './Display'
import {Keyboard} from './Keyboard'
import  {useState} from 'react'

export const Calculator = ()=>{ //creamos el componente Calculator

   const [expression, setExpression] = useState('0'); //este componente dependerá del estado, en está versión evaluarémos una expresión

   const handleBtnClick = (value) =>{ //se crea la función para manejar los clicks

      if(value === 'C') setExpression('0');//Si clicamos en 'C' ponemos el Display a 0
      else if (value ==='Del') setExpression(expression.slice(0,-1)) //Borramos el ultimo digito
      else if (value === '='){ //Si clicamos en el =
         try{    
            const result = Function( // llamamos a una funcion para evaluar el string
            
               `return (${expression})`// devolverá la expresion que hay en pantalla
            )(); //se acaba la funcion de evaluacion
            setExpression(result.toString()) // y se actualliza la pantalla con el resultado
         }
         catch{
            setExpression('ERROR') //Si no se ha podido realizar la evaluacion, se pinta un error
         }            
      } // fin del else del = 
      else { //Ultimo condicional, se han descartado todos las posiblilidades, solo queda añadir numeros
         setExpression((prev) => prev + value) //se vrea una variable con el valor de la expresion y se le añade el valor introducido
      }
   }

   return (  //Por ultimo se retorna 
      <div className='calculator'>
         <Display value = {expression} /> {/* Se envia al hijo Display el valor de pantalla, sea la expresión o el resultado */}
         <Keyboard  onClickBtn={handleBtnClick} />{/* Se envia al keyboard el valor de los botones clicados */}
      </div>
   )

}
