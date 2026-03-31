# 🧮 Calculadora en React

Este proyecto es una calculadora desarrollada con **React**, creada como ejercicio práctico para afianzar los conceptos fundamentales del framework, poniendo el foco en la gestión del estado, la separación de responsabilidades y el comportamiento de la interfaz de usuario.

## ✨ Características principales

- Arquitectura basada en **componentes reutilizables** (`Calculator`, `Display`, `OperationDisplay`, `Keyboard`, `Button`, `Title`).
- Gestión del estado mediante **useState**, controlando:
  - Valor actual del display
  - Valor previo de la operación
  - Operador seleccionado
  - Estado de nueva operación
- Lógica de cálculo implementada sin `eval` ni `Function`, usando una función explícita y segura.
- Control de errores básicos, como la división por cero.
- Soporte correcto para números decimales, evitando múltiples puntos.
- Reinicio automático de la operación al comenzar un nuevo cálculo tras pulsar `=`.

## 🖥️ Interfaz y experiencia de usuario

- Diseño limpio y moderno, con estilos personalizados en CSS.
- Animaciones suaves en la aparición de los dígitos del display.
- Display secundario integrado visualmente para mostrar la operación completa.
- Teclado responsivo con botones especiales (cero y igual a doble ancho).
- Imagen decorativa integrada en el diseño mediante `z-index`, aportando personalidad sin interferir con la interacción.
- Layout centrado y adaptado a distintos tamaños de pantalla.

## 🎯 Objetivo del proyecto

El objetivo principal de esta calculadora no es solo funcionar correctamente, sino **servir como herramienta de aprendizaje**, entendiendo cómo fluye la información en React, cómo se comunican los componentes mediante props y cómo el estado determina el renderizado de la interfaz.

El proyecto se ha desarrollado de forma progresiva, priorizando soluciones claras y comprensibles frente a implementaciones innecesariamente complejas.

## 🚀 Tecnologías usadas

- React
- JavaScript 
- CSS 

---

Proyecto realizado con fines educativos y de práctica en React.
