Page({
  data: {
    count: 9,
    number: 3,
    length: 224,
    puzzles: [
    ],
    puzzleList: [
    ],
    animate: 'animate-short', // animate-long
    win: false
  },
  onLoad() {
    if (this.options.size) {
      const number = parseInt(this.options.size)
      const count = number * number
      this.setData({
        number,
        count
      })
    }
    const puzzles = []
    const puzzleList = []
    this.number = Math.sqrt(this.data.count)
    const length = 672 / this.number
    for(let i = 0; i < this.data.count; i++) {
      const active = this.data.count !== i + 1
      puzzles.push({ id: i, i, active, step: 0, move: false })
      puzzleList.push({ id: i, i: i, active, step: 0 })
    }
    this.setData({
      puzzles,
      puzzleList,
      length
    })
    this.puzzlesFilter()
    setTimeout(() => {
      this.puzzlesDisorder()
    }, 1500)
  },
  puzzlesFilter() {
    this.data.puzzles.forEach((el, index) => {
      el.move = false
      if (el.i !== this.data.puzzleList[index].i) {
        el.step += 1
        el.move = true
      }
    })
    const arr = this.data.puzzles.map((item) => {
      const x = item.i % this.number, y = Math.floor(item.i / this.number)
      const positionX = x * this.data.length
      const positionY = y * this.data.length
      const imgX = - item.id % this.number * (this.data.length - 4)
      const imgY = - Math.floor(item.id / this.number) * (this.data.length - 4)
      return { ...item, x, y, positionX, positionY, imgX, imgY }
    })
    this.setData({
      puzzleList: arr
    })
  },
  puzzlesDisorder() {
    let i = 0
    const handle = () => {
      setTimeout(() => {
        if (i < this.data.count * 6) {
          const emptyItem = this.data.puzzles.find(el => el.active === false)
          const nearby = this.nearbyFind()
          const { id } = nearby[Math.floor(Math.random() * nearby.length)]
          const randomItem = this.data.puzzles.find(el => el.id === id)
          emptyItem.i ^= randomItem.i
          randomItem.i ^= emptyItem.i
          emptyItem.i ^= randomItem.i
          this.puzzlesFilter()
          i += 1
          handle()
        } else {
          this.setData({
            animate: 'animate-long'
          })
        }
      }, 120 / Math.sqrt(this.data.count))
    }
    handle()
  },
  nearbyFind() {
    const emptyItem = this.data.puzzleList.find(el => el.active === false)
    const nearby = this.data.puzzleList.filter(el => this.checkNearby(el) && !el.move) // 不重复移动
    return nearby
  },
  checkNearby(item) {
    const emptyItem = this.data.puzzleList.find(el => el.active === false)
    let res = false
    if (item.x === emptyItem.x) {
      res = item.y + 1 === emptyItem.y || item.y - 1 === emptyItem.y
    } else if (item.y === emptyItem.y) {
      res = item.x + 1 === emptyItem.x || item.x - 1 === emptyItem.x
    }
    return res
  },
  checkVictory() {
    return this.data.puzzles.every(el => el.id === el.i)
  },
  onTap({ target }) {
    if (!this.data.win) {
      const { dataset } = target
      const { item } = dataset
      if (this.checkNearby(item)) {
        const emptyItem = this.data.puzzles.find(el => el.active === false)
        const currentItem = this.data.puzzles.find(el => el.id === item.id)
        emptyItem.i ^= currentItem.i
        currentItem.i ^= emptyItem.i
        emptyItem.i ^= currentItem.i
        this.puzzlesFilter()
      }
      if (this.checkVictory()) {
        this.setData({
          win: true
        })
      }
    }
  }
})