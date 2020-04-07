class Render {
   constructor() {
      this.buttons = [];
   }
    
   // Создаем новый HTML элемент
   // obj 
   //    - tag: HTML element 
   //    - class: element classes
   //    - style: element style
   //    - text: element text
   //    - href: element href             FOR link
   //    - disabled: element disabled     FOR buttons
   //    - src: element src               FOR image

   static createElement(obj) {        
      const container = document.querySelector(obj.appendTo)
      const element = document.createElement(obj.tag);
      if (obj.class) element.className = obj.class
      if (obj.text) element.innerHTML = obj.text
      if (obj.href) element.href = obj.href
      if (obj.src) element.src = obj.src
      if (obj.style) {
         for(let prop in obj.style) {
               element.style[prop] = obj.style[prop]
         }
      }
      if (obj.disabled) element.disabled = obj.disabled  
      container.append(element)
      
      return element;
   }
    
   init() {
      for (let block of  ['header', 'description', 'buttons', 'result']) {
         Render.createElement({tag: 'div', class: `row ${block}`, appendTo: '.container'})
      }
      
      Render.createElement({tag: 'h1', class: `header-text`, appendTo: '.header', text: 'Bubble Sort'})
      Render.createElement({tag: 'p', class: `description-text`, appendTo: '.description', 
      text: `Сортировка пузырьком <em>(англ. bubble sort)</em> — простой алгоритм сортировки.<br> 
         Для понимания и реализации этот алгоритм — простейший, но 
         эффективен он лишь для небольших массивов.<br> 
         Сложность алгоритма: O(n<sup>2</sup>).<br>
         <b>MAKE</b>     - Cгенерировать набор данных для сортировки.<br>
         <b>RUN</b>      - Запустить сортировку.<br>
         <b>PAUSE</b>    - Поставить сортировку на паузу.<br>
         <b>CLEAR</b>    - Очистить все поля.<br>
         <b>SHOW</b>     - Показать первоначальный неотсортированный набор данных.<br>
         `})

      for (let button of  ['make', 'run', 'pause', 'clear', 'show']) {
         let btn = Render.createElement({tag: 'button', class: `${button} col-md-2`, appendTo: '.buttons', text: button.toUpperCase(), disabled: true})
         this.buttons.push(btn)
      }

      Render.createElement({tag: 'canvas', appendTo: '.result'})
   }

   update(file) {
      Render.createElement({tag: 'a', class: 'forkme', appendTo: 'body', href: 'https://github.com/kuznetsovandrey76'})
      Render.createElement({tag: 'img', appendTo: '.forkme', src: file, 
         style: {
               top: 0,
               right: 0,
               width: '15%',
               position: 'absolute'
         }
      })
   }
}

module.exports = Render;