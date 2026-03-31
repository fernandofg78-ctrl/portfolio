import {Display} from './Display'
import {Keyboard} from './Keyboard'
import {Title} from './Title'
import {useState} from 'react'
import {OperationDisplay} from './OperationDisplay'
import robotImg from '../assets/react-robot.png'

function Calculator() {

   const [current, setCurrent] = useState(''); //variable para el valor actual del display
   const [previus, setPrevius] = useState(null);//variable para el valor guardado al clicar en el operador
   const [operator, setOperator] = useState(null);//variable que guarda el operador
   const [displayOperation, setDisplayOperation] = useState(''); //variable para el display secundario
   const [newOp, setNewOp] = useState(false); //variable que marca la nueva operacion, sirve para poner el display a 0 al comenzar una nueva
   
   

   function calculate (a,b, op){ //Esta funcion está clara, no hacen falta comentarios
      const n1 = Number (a)
      const n2 = Number (b)

      switch(op){
      case "+":
         return (n1 + n2).toString();
      case "-":
         return (n1 - n2).toString();
      case "*":
         return (n1 * n2).toString();
      case "/":
         return n2 === 0 ? "Error" : (n1 / n2).toString();
      default:
         return b;
      }        
   }

   const cleanDisplays = () => { //funcion para poner las variables a valores de inicio
      setCurrent ('');
      setOperator(null)
      setPrevius(null)
      setDisplayOperation('');
      setNewOp(false)
   }

   const handleBtnClick = (value) =>{  //Esta función es para aignar los valores a las distintos varialbles
      
      if(newOp && (!isNaN(value) || value === '.')){ // simplemente si ya se ha finalizado la operacion y clicamos oto numero, reiniciamos todas las variables
         cleanDisplays();
         setCurrent(num => num + value)
         return;
      }

      

      if(!isNaN(value) || value === '.'){ //Solo se ejecuta si el boton pulsado es un numero o un decimal, es decir operadores y demás botones, no entran aqui
         if(operator !== null && previus !== null && current === previus){ // esta condicion es para mantener el valor de pantalla hasta que se introdizca el segundo numero
            if(value === '.') setCurrent('0.') //Sirve para poder poner un 0, en la segunda operacion
            else  setCurrent(value) //Se pone el valor de current en blanco}
            return;
         } 
         if(current ==='' && value==='.'){ //Relativo al punto, es para que si si pone un punto sin que haya valor, se pinte in 0. :-)
            setCurrent('0.')
            return
         }                       
         if(current.includes('.') && value==='.') return //Simplemente para que no se puedan meter mas de 1 punto
         
         setCurrent((previus) => previus + value);
         return
         
      }

      if (value === 'C'){ //Si se clika el C ponemos todo como al principio
         cleanDisplays()
         return
      }

      if(['+', '-', '*', '/'].includes(value)){ //Si el value incluye los operadores
         if(newOp){//condicion para poder usar el resultado anterior en la siguiente operacion
            setPrevius(current)
            setOperator(value)
            setDisplayOperation(`${current} ${value} `)
            setNewOp(false)
            return
         }
         if (previus === null) {
            setPrevius(current);
            setDisplayOperation(`${current} ${value} `); // Primera vez que pulsas un operador
         } else if (operator) {
            // Si ya había una operación en curso, calculamos el subtotal
            const subResult = calculate(previus, current, operator);
            setPrevius(subResult);
            setCurrent(subResult); // Mostramos el subtotal
            setDisplayOperation(`${subResult} ${value} `);
         }      
                 
         setOperator(value) // Se asigna al operador el valor del boton
         return;
            
      }        
      

      if(value === 'Del'  ){
         setCurrent((previus) =>previus.slice(0,-1))
         return;
      }

      if(value === '=' && previus !== null && operator !== null){ //si se clica = y hay previo y operador
         const result = calculate(previus, current, operator) // se crea la variable resultado llamando a la funcion y pasandole los parametros
         
         setDisplayOperation(`${previus} ${operator} ${current} =`) //esto es lo que se va a ver en el display de operaciones

         setCurrent(result) // el valor de pantalla pasa a ser el resultado
        
         setPrevius(null);
         setOperator(null);
         setNewOp(true);
         return;
      }
   }



   return (

      <>

         <div className="scene">
            <img src={robotImg} className="robot"/>
        
            <div className = 'calculator-wrapper'>
               <Title title = 'Calculadora React' />
               <div className = 'calculator'> 
                  <div className = 'display-wrapper'>
                     <OperationDisplay 
                        previus  = {previus}
                        operator = {operator}
                        operation  = {displayOperation}
                     />       
                     <Display value = {current || '0'} />
                  </div>
                  <Keyboard onClickBtn = {handleBtnClick} />
               </div>
            </div>
         </div>
      </>
   )
}

export default Calculator;