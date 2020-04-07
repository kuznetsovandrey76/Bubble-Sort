const Constants = require('./Constants')
const Bubble = require('./Bubble')
const Render = require('./Render')

const Lib = require('./Lib')
const lib = new Lib();

// Хранит все данные
let DATA;

class Action {
   constructor() {

      // Defaul buttons props
      this.disabled = {
               make  : false,  
               run   : true,  
               pause : true,  
               clear : true, 
               show  : true 
      }

      // Show default array  
      this.showArr  = false
   }
   
   static create() {
      const action = new Action()   

      // Обработка событий
      const buttons_container = document.querySelector('.buttons');
      action.eventHandlers(buttons_container)

      action.updateButtons()
      action.init()
      return action;
   }

   init() {
      window.onresize = () => {
         if ( this.showArr ) {
               let resultWidth = document.querySelector('.result').offsetWidth
               DATA.clear()
               DATA.width = resultWidth
               DATA.init()

               // fix
               this.hideDefaultArray()
         }
      }
   }

   // button MAKE
   makeArray() {
      this.showArr = true

      // Генерируем случайный массив чисел
      const unsortedArr = lib.createArray()
      DATA = Bubble.create(unsortedArr)
      DATA.init()
   }

   // button RUN
   run() {
      window.onblur = () => {
         // Window not active
         this.disabled = {
               make   : true,  
               run    : false,  
               pause  : true,  
               clear  : false, 
               show   : false 
         }
         this.updateButtons()
         this.pause()
      }
      
      window.onfocus = () => {
         // Window active
      }

      DATA.intervalID = setInterval(() => {
         if (DATA.finished) {
               this.disabled = {
                  make   : false,  
                  run    : true,  
                  pause  : true,  
                  clear  : false, 
                  show   : false 
               }
               this.updateButtons()
               clearInterval(DATA.intervalID) 
         } 
         else {
               DATA.start()
         } 
      }, 1000 / Constants.SPEED)

      // requestAnimationFrame(this.run.bind(this)) FOR GAME
   }

   // button PAUSE
   pause() {
      clearInterval(DATA.intervalID)
   }

   // button CLEAR
   clear() {
      this.showArr = false

      clearInterval(DATA.intervalID)
      DATA.clear()
   }

   // button SHOW
   show() {
      const defaultCanvasName = Constants.DEFAULT_CANVAS_ARRAY

      Render.createElement({tag: 'canvas', class: defaultCanvasName, appendTo: '.result'})
      let showDefault = Bubble.create(DATA.defaultArray, defaultCanvasName)
      showDefault.init()
   }

   // Обновляем данные buttons
   // clicked_element: string - нажатая кнопка 
   updateState(clicked_element) {
      switch (clicked_element) {
         case 'make':
               this.disabled = {
                  make   : false,  
                  run    : false,  
                  pause  : true,  
                  clear  : false, 
                  show   : false 
               }
               break
         case 'run':
               this.disabled = {
                  make   : true,  
                  run    : true,  
                  pause  : false,  
                  clear  : true, 
                  show   : true 
               }
               break                
         case 'pause':
               this.disabled = {
                  make   : true,  
                  run    : false,  
                  pause  : true,  
                  clear  : false, 
                  show   : false 
               }
               break
         case 'clear':
               this.disabled = {
                  make   : false,  
                  run    : true,  
                  pause  : true,  
                  clear  : true, 
                  show   : true 
               }
               break
         case 'show':
               this.disabled.show  = true 
               break
         default:
               console.log('Error')
      }
   }

   updateButtons() {
      for (let key in this.disabled) {
         document.querySelector(`.${key}`).disabled = this.disabled[key]
      }
   }

   // Запуск функции
   // clicked_element: string - нажатая кнопка 
   buttonsFunc(clicked_element) {
      switch(clicked_element) {
         case 'make':
               this.makeArray()
               this.hideDefaultArray()
               break
         case 'run':
               this.run()
               break                
         case 'pause':
               this.pause()
               break
         case 'clear':
               this.clear()
               this.hideDefaultArray()
               break
         case 'show':
               this.show()
               break
         default:
               console.log('Error')
      }
   }

   // Убрать исходный массив
   hideDefaultArray() {
      let canvasDefault = document.querySelector(`.${Constants.DEFAULT_CANVAS_ARRAY}`)
      canvasDefault ? canvasDefault.remove() : false;
   }

   eventHandlers(buttons_container) {
      buttons_container.addEventListener('click', (e) => {
         let clicked_element = e.target.className.split(' ')[0];
         
         this.updateState(clicked_element)
         this.updateButtons()
         this.buttonsFunc(clicked_element)
      })
   }
}

module.exports = Action;
