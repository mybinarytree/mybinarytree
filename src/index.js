import './style'

const ios = /iphone/i.test(navigator.userAgent)
const android = !ios

const { documentElement } = document

document.addEventListener('DOMContentLoaded', async () => {

  let draw

  // i18n
  document.querySelector('nav').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() !== 'span') {
      return
    }
    document.title = document.querySelector('title').getAttribute(documentElement.classList.contains('zh') ? 'zh' : 'en')
    if (/^[a-zA-Z]*$/.test(event.target.innerText)) {
      documentElement.classList.add('en')
      documentElement.classList.remove('zh')
      _hmt.push(['_trackEvent', 'index', 'click', 'i18n', 'en'])
    } else {
      documentElement.classList.add('zh')
      documentElement.classList.remove('en')
      _hmt.push(['_trackEvent', 'index', 'click', 'i18n', 'zh'])
    }
  }, false)

  // route and controller
  {
    [].forEach.call(document.querySelectorAll('article:nth-of-type(1) button'), (button) => {
      button.addEventListener('click', () => {
        documentElement.classList.add('easel')
        documentElement.classList.remove('home')
        _hmt.push(['_trackEvent', 'index', 'click', 'start'])
      }, false)
    })
  }
  {
    [].forEach.call(document.querySelectorAll('article:nth-of-type(2) button'), (button) => {
      button.addEventListener('click', () => {
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

    const green = 'green'
    const brown = 'brown'

    // stage.enableDOMEvents(true)
    // stage.enableMouseOver(true)

    stage.addEventListener('stagemousedown', () => {
      const circle = new createjs.Shape()
      const color = Math.round(Math.random() * 2) ? green : brown
      circle.graphics.beginFill(color).drawCircle(0, 0, 16)
      const dx = Math.round(Math.random() * 100)
      const dy = Math.round(Math.random() * 100)
      const nx = Math.round(Math.random() * 2) ? 1 : -1
      const ny = Math.round(Math.random() * 2) ? 1 : -1
      circle.x = width / 2 + dx * nx
      circle.y = height / 2 + dy * ny
      stage.addChild(circle)
    })
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
    context.rect(0, 0, width, height)
    context.fillStyle = '#fff'
    context.fill()
  }

  // draw qrcode
  {
    const div = document.createElement('div')
    const size = 100
    new QRCode(div, {
      text: `${location.origin}${location.pathname}?y=${2018}&t=${+new Date}`,
      width: size,
      height: size,
      colorDark : '#000000',
      colorLight : '#ffffff',
      correctLevel : QRCode.CorrectLevel.M
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
    const size = 28
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
    const green = '#148d16'
    const brown = '#6e482c'
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
    // context.drawImage(document.querySelector('canvas'), )
    let base64 = canvas.toDataURL('image/jpeg', 1)
    document.querySelector('aside img').src = base64
    // let base64 = ''
    // if (ios) {
    //   base64 = canvas.toDataURL('image/jpeg', 1)
    // }
    // if (android) {
    //   const encoder = new JPEGEncoder()
    //   const { width, height } = canvas
    //   base64 = encoder.encode(context.getImageData(0, 0, width, height), 100)
    // }
    // console.log(base64)
  }

}, false)
