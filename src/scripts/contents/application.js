import $ from 'jquery'

export class Application {
  static createDefaultOptions() {
    return {
      updateInterval: 1000,
      cardColorEnabled: true,
      cardColorOpacity: 0.7,
      cardNumberEnabled: true,
      cardCoverEnabled: true,
      windowSizeAdjustment: true,
      windowSize: 80,
      windowSizeMax: 960
    }
  }

  constructor(options = {}) {
    const defaults = Application.createDefaultOptions()
    this.config = Object.assign({}, defaults, options)

    // Trello Board Only
    // CardList (https://trello.com/b/*)
    // CardDetail (https://trello.com/c/*)
    this.updatePath = /^\/[bc]\//

    // Instance variables
    this.debug = process.env.NODE_ENV === 'development'
    this.updateId = null

    this.log(`Hello Trello Design! (NODE_ENV: ${process.env.NODE_ENV})`)
    this.log('constructor\n' + JSON.stringify(this.config))
  }

  log(message) {
    if (!this.debug) return
    console.log('[Trello Design] ' + message)
  }

  start() {
    this.update()
    this.updateId = setInterval(() => this.update(), this.config.updateInterval)
  }

  update() {
    // Trello Board Only
    if (!this.updatePath.test(window.location.pathname)) {
      return
    }

    // Style
    this.updateStyle()

    // CardNumber
    const cards = $('.list-card')
    for (let i = 0; i < cards.length; i++) {
      const card = $(cards[i])
      this.updateCardNumber(card)
    }

    // CardColor
    const cardLabels = $('.card-label')
    for (let i = 0; i < cardLabels.length; i++) {
      const cardLabel = $(cardLabels[i])
      this.updateCardColor(cardLabel)
    }
  }

  updateStyle(force = false) {
    let style = $('#js-trello-design-style')
    if (!style.length) {
      $('head').append('<style id="js-trello-design-style"></style>')
      style = $('#js-trello-design-style')
    } else if (!force) {
      return
    }
    let css = ''
    // 一覧でのカバー画像表示
    const coverStyle = this.config.cardCoverEnabled ? 'block' : 'none'
    css += `
      .js-card-cover { display: ${coverStyle} !important; }
    `
    // 詳細でカードサイズを調整する
    if (this.config.windowSizeAdjustment) {
      css += `
        .window {
          width: ${this.config.windowSize}% !important;
          max-width: ${this.config.windowSizeMax}px !important;
          background-color: white !important;
          margin: 20px !important;
          border-radius: 8px;
        }
        .window-main-col {
          width: calc(80% - 32px) !important;
          margin: 0 !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .window-sidebar {
          width: calc(20% - 32px) !important;
          margin: 0 !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      `
    }
    style.html(css)
  }

  updateCardNumber(card) {
    const badges = card.closest('.list-card').find('.badges')

    // No.が変更されることはないので追加済みなら処理しない
    const customBadges = badges.find('.js-td-badges')
    if (customBadges.length) {
      // リセット
      if (!this.config.cardNumberEnabled) {
        customBadges.remove()
      }
      return
    }

    // リセット
    if (!this.config.cardNumberEnabled) {
      customBadges.remove()
      return
    }

    // idを取得 (hrefから取得)
    // e.g. href="/c/abc123/45-no45-XXXX"
    const url = card.attr('href')
    if (!url) {
      return
    }
    const pathname = url.split('/').pop()
    const id = pathname.split('-')[0]

    // 要素を追加
    // (Power-Upは`js-plugin-badges`という名前なので被らないようにする)
    badges.prepend('' +
      '<span class="td-badges js-td-badges">' +
      '<span>' +
      '<div class="td-badges__badge">' +
      '<span class="td-badges__badge-text">' +
      'No.' + id +
      '</span>' +
      '</div>' +
      '</span>' +
      '</div>'
    )
  }

  updateCardColor(cardLabel) {
    const listCard = cardLabel.closest('.list-card')

    // リセット
    if (!this.config.cardColorEnabled) {
      listCard.css({'background-color': ''})
      return
    }

    const backgroundColor = cardLabel.css('background-color')
    if (!backgroundColor) {
      return
    }

    const backgroundColorRGB = backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i)
    if (!backgroundColorRGB || backgroundColorRGB.length !== 4) {
      return
    }

    const cssColor = 'rgba(' +
      backgroundColorRGB[1] + ',' +
      backgroundColorRGB[2] + ',' +
      backgroundColorRGB[3] + ',' +
      this.config.cardColorOpacity + '' +
      ')'
    listCard.css({'background-color': cssColor})
  }

  // popup.jsからのコールバック
  refresh(options) {
    this.log('refresh\n' + JSON.stringify(options))

    const intervalChanged = (options.updateInterval != null && this.config.updateInterval !== options.updateInterval)
    const styleChanged = (
      (options.cardCoverEnabled != null && this.config.cardCoverEnabled !== options.cardCoverEnabled) ||
      (options.windowSizeAdjustment != null && this.config.windowSizeAdjustment !== options.windowSizeAdjustment) ||
      (options.windowSize != null && this.config.windowSize !== options.windowSize) ||
      (options.windowSizeMax != null && this.config.windowSizeMax !== options.windowSizeMax)
    )
    this.config = Object.assign({}, this.config, options)

    if (styleChanged) {
      this.log('updateStyle')

      this.updateStyle(true)
    }

    if (intervalChanged) {
      this.log('intervalChanged\n' + this.config.updateInterval)

      clearInterval(this.updateId)
      this.start()
    }
  }
}
