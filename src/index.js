import './style'

const ios = /iphone/i.test(navigator.userAgent)
const android = !ios

const green = '#148d16'
const brown = '#6e482c'

const { documentElement } = document

document.addEventListener('DOMContentLoaded', async () => {

  let draw

  // i18n
  document.querySelector('nav').addEventListener('click', (event) => {
    // debugger
    if (event.target.tagName.toLowerCase() !== 'span') {
      return
    }
    if (/^[a-zA-Z]*$/.test(event.target.innerText)) {
      documentElement.classList.add('en')
      documentElement.classList.remove('zh')
      document.title = document.querySelector('title').getAttribute('en')
      _hmt.push(['_trackEvent', 'index', 'click', 'i18n', 'en'])
    } else {
      documentElement.classList.add('zh')
      documentElement.classList.remove('en')
      document.title = document.querySelector('title').getAttribute('zh')
      _hmt.push(['_trackEvent', 'index', 'click', 'i18n', 'zh'])
    }
  }, false)

  // route and controller
  {
    [].forEach.call(document.querySelectorAll('article:nth-of-type(1) button'), (button) => {
      button.addEventListener('click', () => {
        // debugger
        documentElement.classList.add('easel')
        documentElement.classList.remove('home')
        _hmt.push(['_trackEvent', 'index', 'click', 'start'])
      }, false)
    })
  }
  {
    [].forEach.call(document.querySelectorAll('article:nth-of-type(2) button'), (button) => {
      button.addEventListener('click', () => {
        // debugger
        if (draw) {
          draw()
        }
        documentElement.classList.add('preview')
        documentElement.classList.remove('easel')
        _hmt.push(['_trackEvent', 'index', 'click', 'done'])
      }, false)
    })
  }
  document.querySelector('aside i').addEventListener('click', () => {
    documentElement.classList.add('easel')
    documentElement.classList.remove('preview')
  }, false)

  // canvas of playground
  {
    const canvas = document.querySelector('canvas')
    const stage = new createjs.Stage(canvas)
    const { width, height } = canvas

    createjs.Ticker.framerate = 60
    createjs.Ticker.addEventListener('tick', stage)

    createjs.Touch.enable(stage)

    // stage.enableDOMEvents(true)
    // stage.enableMouseOver(true)

    // stage.addEventListener('stagemousedown', () => {
    //   const circle = new createjs.Shape()
    //   const color = Math.round(Math.random() * 2) ? green : brown
    //   circle.graphics.beginFill(color).drawCircle(0, 0, 16)
    //   const dx = Math.round(Math.random() * 100)
    //   const dy = Math.round(Math.random() * 100)
    //   const nx = Math.round(Math.random() * 2) ? 1 : -1
    //   const ny = Math.round(Math.random() * 2) ? 1 : -1
    //   circle.x = width / 2 + dx * nx
    //   circle.y = height / 2 + dy * ny
    //   stage.addChild(circle)
    // })

    const r = 30

    const trunk = new createjs.Shape()
    stage.addChild(trunk)

    const leaf = new createjs.Container()
    stage.addChild(leaf)

    const total = 30
    for (let index = 0; index < total; index++) {
      const piece = new createjs.Shape()
      leaf.addChild(piece)
    }

    const line = new createjs.Shape()
    stage.addChild(line)

    const root = new createjs.Shape()
    root.graphics.beginFill(brown).drawCircle(0, 0, r)
    root.x = width / 2
    root.y = height / 2 + 140
    stage.addChild(root)

    const left = new createjs.Shape()
    left.graphics.beginFill(green).drawCircle(0, 0, r)
    left.x = width / 2 - 90
    left.y = height / 2 - 60
    stage.addChild(left)

    const right = new createjs.Shape()
    right.graphics.beginFill(green).drawCircle(0, 0, r)
    right.x = width / 2 + 90
    right.y = height / 2 - 60
    stage.addChild(right)

    const color = (hex, deep) => `#${(parseInt(hex.slice(1), 16) + 1118481 * deep).toString(16)}`

    createjs.Ticker.addEventListener('tick', () => {
      trunk.graphics
        .clear()
        .beginFill(color(brown, 2))
        .moveTo(0, height + r * 2)
        .bezierCurveTo(root.x - r * 2, root.y + r, root.x - r * 2, root.y - r, left.x, left.y)
        .bezierCurveTo(root.x - r * 2, root.y - r * 3, root.x + r * 2, root.y - r * 3, right.x, right.y)
        .bezierCurveTo(root.x + r * 2, root.y - r, root.x + r * 2, root.y + r, width, height + r * 2)
      line.graphics
        .clear()
        .beginStroke(color(brown, 1))
        .moveTo(left.x, left.y)
        .lineTo(root.x, root.y)
        .lineTo(right.x, right.y)
      const position = [
        [left.x - 60 * 1, left.y - 60 * 1],
        [left.x + 80 * 0, left.y - 80 * 1],
        [left.x + 60 * 1, left.y - 60 * 1],
        [left.x - 80 * 1, left.y + 80 * 0],
        [left.x + 80 * 1, left.y + 80 * 0],
        [left.x - 60 * 1, left.y + 60 * 1],
        [left.x + 80 * 0, left.y + 80 * 1],
        [left.x + 60 * 1, left.y + 60 * 1],
        [right.x - 60 * 1, right.y - 60 * 1],
        [right.x + 80 * 0, right.y - 80 * 1],
        [right.x + 60 * 1, right.y - 60 * 1],
        [right.x - 80 * 1, right.y + 80 * 0],
        [right.x + 80 * 1, right.y + 80 * 0],
        [right.x - 60 * 1, right.y + 60 * 1],
        [right.x + 80 * 0, right.y + 80 * 1],
        [right.x + 60 * 1, right.y + 60 * 1],
      ]
      leaf.children.forEach((piece, index) => {
        const anchor = position[index]
        if (!anchor) {
          return
        }
        piece.graphics
          .clear()
          .beginFill(color(green, 2))
          .drawCircle(anchor[0], anchor[1], 80)
      })
    })

    {
      let shapeStartX
      let touchStartX
      root.addEventListener('mousedown', (event) => {
        shapeStartX = root.x
        touchStartX = event.stageX
      }, false)
      root.addEventListener('pressmove', (event) => {
        const nextX = shapeStartX + (event.stageX - touchStartX)
        root.x = Math.max(width * .1, Math.min(nextX, width * .9))
      }, false)
      root.addEventListener('pressup', (event) => {
        shapeStartX = null
        touchStartX = null
      }, false)
    }
    {
      let shapeStartX
      let shapeStartY
      let touchStartX
      let touchStartY
      left.addEventListener('mousedown', (event) => {
        shapeStartX = left.x
        shapeStartY = left.y
        touchStartX = event.stageX
        touchStartY = event.stageY
      }, false)
      left.addEventListener('pressmove', (event) => {
        const nextX = shapeStartX + (event.stageX - touchStartX)
        left.x = Math.max(width * .1, Math.min(nextX, right.x - r - width * .1))
        const nextY = shapeStartY + (event.stageY - touchStartY)
        left.y = Math.max(height * .1, Math.min(nextY, root.y - r - height * .1))
      }, false)
      left.addEventListener('pressup', (event) => {
        shapeStartX = null
        shapeStartY = null
        touchStartX = null
        touchStartY = null
      }, false)
    }
    {
      let shapeStartX
      let shapeStartY
      let touchStartX
      let touchStartY
      right.addEventListener('mousedown', (event) => {
        shapeStartX = right.x
        shapeStartY = right.y
        touchStartX = event.stageX
        touchStartY = event.stageY
      }, false)
      right.addEventListener('pressmove', (event) => {
        const nextX = shapeStartX + (event.stageX - touchStartX)
        right.x = Math.max(left.x + r + width * .1, Math.min(nextX, width * .9))
        const nextY = shapeStartY + (event.stageY - touchStartY)
        right.y = Math.max(height * .1, Math.min(nextY, root.y - r - height * .1))
      }, false)
      right.addEventListener('pressup', (event) => {
        shapeStartX = null
        shapeStartY = null
        touchStartX = null
        touchStartY = null
      }, false)
    }
  }

  // canvas of photo
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const width = 560
  const height = 560 * 1.22

  // canvas of photo initialize
  {
    canvas.width = width
    canvas.height = height

    context.clearRect(0, 0, width, height)
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
  }

  // draw qrcode
  {
    const div = document.createElement('div')
    const size = 100
    new QRCode(div, {
      text: `${location.origin}${location.pathname}?y=${2018}&t=${+new Date}`,
      width: size * 2,
      height: size * 2,
      colorDark : '#000000',
      colorLight : '#ffffff',
      correctLevel : QRCode.CorrectLevel.H
    })
    const qrcode = div.querySelector('img')
    await new Promise((resolve) => {
      if (qrcode.width) {
        resolve()
      } else {
        qrcode.onload = resolve
      }
    })
    context.drawImage(qrcode, 30, height - size - 25, size, size)
  }

  // draw logo
  {
    const logo = document.querySelector('header img')
    const size = 22
    const qrcode = 100
    await new Promise((resolve) => {
      if (logo.width) {
        resolve()
      } else {
        logo.onload = resolve
      }
    })
    context.drawImage(logo, 30 + (qrcode - size) / 2, height - size - 24 - (qrcode - size) / 2, size, size)
  }

  // draw shadow
  {
    const playground = document.querySelector('canvas')
    context.shadowColor = 'rgba(0, 0, 0, .5)'
    context.shadowBlur = 15
    context.fillStyle = '#fff'
    const padding = (width - playground.width) / 2
    context.fillRect(padding, padding, playground.width, playground.height)
    context.shadowBlur = 0
  }

  draw = function () {
    const playground = document.querySelector('canvas')
    const x = 150
    const y = height * 0.855
    const line = parseFloat(getComputedStyle(playground).lineHeight)
    context.fillStyle = '#fff'
    // context.fillStyle = 'red'
    context.fillRect(x - line / 2, y - line, 500, line * 4)
    context.font = `${getComputedStyle(playground).fontSize} ${getComputedStyle(playground).fontFamily}`
    const now = new Date()
    const year = now.getFullYear()
    const month = `0${now.getMonth() + 1}`.slice(-2)
    const date = `0${now.getDate()}`.slice(-2)
    const hour = `0${now.getHours()}`.slice(-2)
    const minute = `0${now.getMinutes()}`.slice(-2)
    const second = `0${now.getSeconds()}`.slice(-2)
    const time = `${year}/${month}/${date} ${hour}:${minute}:${second}`
    if (documentElement.classList.contains('zh')) {
      {
        const text = '这棵二叉树出生在'
        context.fillStyle = brown
        context.fillText(text, x, y)
      }
      {
        const text = time
        context.fillStyle = green
        context.fillText(text, x, y + line)
      }
      {
        const text = '快来种一棵二叉树吧'
        context.fillStyle = brown
        context.fillText(text, x, y + line * 2)
      }
    }
    if (documentElement.classList.contains('en')) {
      {
        const text = 'This Binary Tree has been planted'
        context.fillStyle = brown
        context.fillText(text, x, y)
      }
      {
        const text = 'since'
        context.fillStyle = brown
        context.fillText(text, x, y + line)
      }
      {
        const text = time
        context.fillStyle = green
        context.fillText(text, x + context.measureText('since' + ' ').width, y + line)
      }
      {
        const text = 'Let\'s plant a Binary Tree'
        context.fillStyle = brown
        context.fillText(text, x, y + line * 2)
      }
    }

    context.fillStyle = '#fff'
    const padding = (width - playground.width) / 2
    context.fillRect(padding, padding, playground.width, playground.height)
    context.drawImage(playground, padding, padding, playground.width, playground.height)

    if (ios) {
      const base64 = canvas.toDataURL('image/jpeg', 1)
      document.querySelector('aside img').src = base64
    }
    if (android) {
      const encoder = new JPEGEncoder()
      const base64 = encoder.encode(context.getImageData(0, 0, width, height), 100)
      document.querySelector('aside img').src = base64
    }
  }

  // test
  // documentElement.classList.remove('home')
  // documentElement.classList.add('easel')

}, false)
