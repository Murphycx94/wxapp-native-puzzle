Page({
  data: {
    puzzles: [
      { id: 0, i: 0, active: true, step: 0, move: false },
      { id: 1, i: 1, active: true, step: 0, move: false },
      { id: 2, i: 2, active: true, step: 0, move: false },
      { id: 3, i: 3, active: true, step: 0, move: false },
      { id: 4, i: 4, active: true, step: 0, move: false },
      { id: 5, i: 5, active: true, step: 0, move: false },
      { id: 6, i: 6, active: true, step: 0, move: false },
      { id: 7, i: 7, active: true, step: 0, move: false },
      { id: 8, i: 8, active: false, step: 0, move: false }
    ],
    puzzleList: [
      { id: 0, i: 0, active: true, step: 0 },
      { id: 1, i: 1, active: true, step: 0 },
      { id: 2, i: 2, active: true, step: 0 },
      { id: 3, i: 3, active: true, step: 0 },
      { id: 4, i: 4, active: true, step: 0 },
      { id: 5, i: 5, active: true, step: 0 },
      { id: 6, i: 6, active: true, step: 0 },
      { id: 7, i: 7, active: true, step: 0 },
      { id: 8, i: 8, active: false, step: 0 }
    ],
    animate: 'animate-short', // animate-long
    win: false
  },
  onLoad() {
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
      const x = item.i % 3, y = Math.floor(item.i / 3)
      const positionX = x * 224
      const positionY = y * 224
      const imgX = - item.id % 3 * 220
      const imgY = - Math.floor(item.id / 3) * 220
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
        if (i < 20) {
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
      }, 120)
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