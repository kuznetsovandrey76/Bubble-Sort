const Constants = require('./Constants')

// defaultArray   - [] - исходный массив
// arr            - [] - временный массив
// currentElement - Number
// lastElement    - Number
// pass           - Number - кол-во проходов ( == Constants.ARR_SIZE )
// comparison     - Number - кол-во сравнений ( == Constants.ARR_SIZE / 2 * (Constants.ARR_SIZE - 1) )   
// finished       - Boolean - завершена сортировка

// needSwap       - Boolean - необходима перестановка
// stepIntervaID  - Number - ID перестановки
// changing_delta - Number - расстояние между изменяемыми элементами       
// changing_x0    - Number        
// changing_x1    - Number        
// test_changing_element   
class Bubble {
   constructor(arr, ctx, width, height) {
      this.defaultArray            = [...arr]
      this.tempArray               = arr
      this.currentElement          = 0
      this.lastElement             = this.tempArray.length
      
      this.pass                    = 0 
      this.comparison              = 0
      this.changeElement           = 0

      this.finished                = false
      this.needSwap                = false

      this.width                   = width
      this.height                  = height
      this.ctx                     = ctx
      
      this.intervalID              = 0 
      this.stepIntervaID           = 0 

      this.changing_delta          = 0
      this.changing_x0             = 0
      this.changing_x1             = 0
      this.test_changing_element   = 0
   }

   static create(arr, name) {
      let canvasName  = name ? `.${name}` : 'canvas'
      const width     = document.querySelector('.container').offsetWidth
      const height    = Constants.MAX_NUMBER + Constants.CTX_TEXT_SIZE
      let canvas      = document.querySelector(canvasName)
      canvas.width    = width
      canvas.height   = height
      let ctx         = canvas.getContext('2d')        

      return new Bubble(arr, ctx, width, height)
   }
   
   init() {
      this.ctx.lineWidth = Constants.CTX_LINE_WIDTH
      this.ctx.font = `${Constants.CTX_TEXT_SIZE}px serif`

      this.drawDefault()
   }

   start() {
      return this.compare(this.currentElement)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.width, this.height)
   }

   drawDefault(changingElements) {
      this.ctx.strokeStyle = Constants.STROKE_COLOR_DEFAULT
      this.ctx.fillStyle = Constants.FILL_COLOR
      
      this.tempArray.forEach((data, index) => { 
         
         if (changingElements && changingElements.indexOf(index) != -1) {
               // Изменяемые элементы не выводить в отрисовку 

         } else {                
               this.drawStroke(index, data)  
               this.drawFill(index, data, Constants.FILL_COLOR)  
               this.drawText(index, data, Constants.STROKE_COLOR_DEFAULT)  
         }
      })
   }

   drawSort(elements, fillColor) {
      this.clear()
      this.drawDefault()

      elements.forEach((index) => {
         this.drawFill(index, this.tempArray[index], fillColor)  
      })
   }

   drawStroke(index, data, x0) {
      let coord_x0 = index * this.width / Constants.ARR_SIZE + Constants.CTX_LINE_WIDTH / 2 +  Constants.SPACING_BETWEEN_COLUMNS
      if (index == null) coord_x0 = x0, index = 1

      this.ctx.strokeRect(  // x0, y0, width, height
         coord_x0,
         this.height - data + Constants.CTX_LINE_WIDTH / 2 - Constants.CTX_TEXT_SIZE / 2,                                    
         this.width / Constants.ARR_SIZE - Constants.CTX_LINE_WIDTH -  Constants.SPACING_BETWEEN_COLUMNS,         
         data - Constants.CTX_LINE_WIDTH - Constants.CTX_TEXT_SIZE / 2
      )
   }

   drawFill(index, data, fillColor, x0) {
      this.ctx.fillStyle = fillColor 

      let coord_x0 = index * this.width / Constants.ARR_SIZE + Constants.CTX_LINE_WIDTH / 2 +  Constants.SPACING_BETWEEN_COLUMNS

      if (index == null) coord_x0 = x0, index = 1

      this.ctx.fillRect(  // x0, y0, width, height
         coord_x0,
         this.height - data + Constants.CTX_LINE_WIDTH / 2 - Constants.CTX_TEXT_SIZE / 2,                                    
         this.width / Constants.ARR_SIZE - Constants.CTX_LINE_WIDTH -  Constants.SPACING_BETWEEN_COLUMNS,         
         data - Constants.CTX_LINE_WIDTH - Constants.CTX_TEXT_SIZE / 2                          
      )         
   }

   drawText(index, data, fillColor, x0) {
      let coord_x0 = this.width / Constants.ARR_SIZE / 2 + index * this.width / Constants.ARR_SIZE - Constants.CTX_TEXT_SIZE / 3    
      if (index == null) coord_x0 = x0

      this.ctx.fillStyle = fillColor
      this.ctx.fillText(data, 
         coord_x0,
         this.height
      )
   }

   // Отрисовка изменений
   drawChanging(changingElements, stepIntervaID) {
      this.clear()
      this.drawDefault(changingElements)  
   
      this.ctx.fillStyle = Constants.STROKE_COLOR_CHANGE

      changingElements.forEach((element_number, index) => { 
      
         let coord_x0 = index ? this.changing_x0 : this.changing_x1

         this.drawStroke(null, this.tempArray[element_number], coord_x0)    
         this.drawFill(null, this.tempArray[element_number], Constants.STROKE_COLOR_CHANGE, coord_x0)    

         let text_coord = coord_x0 - Constants.CTX_LINE_WIDTH / 2 - Constants.SPACING_BETWEEN_COLUMNS + this.width / Constants.ARR_SIZE / 2 - Constants.CTX_TEXT_SIZE / 3
         this.drawText(null, this.tempArray[element_number], Constants.STROKE_COLOR_DEFAULT, text_coord)
      })

      if (Math.round(this.changing_x1) <= this.test_changing_element) {
         this.changing_x0 = 0
         this.changing_x1 = 0
         clearInterval(stepIntervaID)
         return this.stepIntervaID = 0
      }

      this.changing_x0 += this.changing_delta
      this.changing_x1 -= this.changing_delta
   }

   // Подсветка элементов 
   highlightUpdate(current, next) {
      this.drawSort([current, next], Constants.STROKE_COLOR_UPDATE)
   }
   
   // Подсветка изменяющихся элементов 
   highlightChange(current, next) {
      this.changing_x0 = current * this.width / Constants.ARR_SIZE + Constants.CTX_LINE_WIDTH / 2 + Constants.SPACING_BETWEEN_COLUMNS
      this.changing_x1 = next * this.width / Constants.ARR_SIZE + Constants.CTX_LINE_WIDTH / 2 + Constants.SPACING_BETWEEN_COLUMNS
      
      this.test_changing_element = this.changing_x0
      this.changing_delta = (this.changing_x1 - this.changing_x0 ) / Constants.FPS_CHANGE

      this.stepIntervaID = setInterval(() => {
         this.drawChanging([current, next], this.stepIntervaID)
      }, 1000 / Constants.SPEED / Constants.FPS_CHANGE)
   }

   change(current, next) {
      let temp = this.tempArray[current]
      this.tempArray[current] = this.tempArray[next]
      this.tempArray[next] = temp

      this.changeElement++
   }

   finishPass(el) {
      this.lastElement = this.currentElement
      this.currentElement = 0
      this.pass++
      this.drawSort([el], Constants.STROKE_COLOR_FINISH)
   }

   test(data) {
      const testPass = Constants.ARR_SIZE
      const testComparison = Constants.ARR_SIZE / 2 * (Constants.ARR_SIZE - 1)

      const test_check = data.pass == testPass && data.comparison == testComparison
      const test_result = test_check ? `OK. Chaneged elements: ${this.changeElement}` : 'Error.'
      
      console.warn(`Test ${test_result}`)
   }

   showDefaultArray() {
      let canvas      = document.querySelector('.canvas-default')
      canvas.width    = this.width
      canvas.height   = this.height
      let ctx         = canvas.getContext('2d')   
      ctx.drawDefault()  
   }

   stop() {
      this.finished = true
      this.drawDefault()

      this.test(this)
   }

   // Сравниваем соседние элементы
   // element: number - текущий элемент
   compare(element) {
      let current = element,
          next    = element + 1

      // Останавливаем сортировку 
      if ( !this.lastElement ) { return this.stop() }

      // Переходим на следующий круг 
      if ( this.currentElement == this.lastElement - 1 ) { return this.finishPass(this.currentElement) }

      // Перестановка элементов
      if ( this.needSwap ) {
         this.highlightChange(current, next)
         this.change(current, next)
         this.needSwap = false

      // Подстветка без перестановки 
      } else if ( !this.stepIntervaID ){
         this.highlightUpdate(current, next)
      }

      // Необходима перестановка
      if (this.tempArray[current] > this.tempArray[next]) {
         return this.needSwap = true            
      }

      this.comparison++
      this.currentElement++
   }
}

module.exports = Bubble