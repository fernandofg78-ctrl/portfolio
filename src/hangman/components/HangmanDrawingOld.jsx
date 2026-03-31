

import './styles/HangmanDrawing.css'


//lo primero en este componente, es definir una constante en la que pongo una clase con las distintas partes del muñegote

const body_parts =[

  <div key='h' className='head' />,
  <div key='b' className='body' />,
  <div key='ra' className='rigth-arm' />,
  <div key='la' className='left-arm' />,
  <div key='rl' className='rigth-leg' />,
  <div key='ll' className='left-leg' />
]


//Despues de crea una funcion a la que se le pasan las letras falladas para que pnte las distintas partes

export const HangmanDrawing = ({numberOfGuesses}) =>{

  return ( //lo primero, retorna siempre las partes fijas del dibujo
    <div className='drawing-container'>
      <div className='rope' />
      <div className='bar-horizontal' />
      <div className='bar-vertical' />
      <div className='bar-base' />
          {/* Y a continuacion, se le pasan las partes que se pintan, dependiendo de los errores */}
      {body_parts.slice(0, numberOfGuesses)} 
            {/* Se toma la constante donde están todas las clases de las distintas partes y se van pinttando el numero de errores con el slice */}
    </div>

  )
}

