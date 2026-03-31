

export const OperationDisplay = ({previus, operator, operation}) =>{ //este componente lo podria haber integrado perfectamente en display,jsx, pero a modo de practica lo he hecho en solitario

   return (
      <div className='operation-display' >
         {previus && operator ? `${previus} ${operator}` : operation}
      </div>
   )
}