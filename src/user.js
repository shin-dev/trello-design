/*
 * © 2020 シン合同会社 - SHIN LLC
 * https://shin-dev.com
 */

const defaults = {
  debug: false,
  updatePath: /^\/b\//, // https://trello.com/b/*
  updateId: null,
  updateInterval: 1000,
  cardColorEnabled: true,
  cardColorOpacity: 0.7,
  cardNumberEnabled: true
}

class Application {
  constructor(options = {}) {
    this.config = Object.assign(defaults, options)
    this.log('Hello Plug-in!')
    this.log(JSON.stringify(this.config))
  }

  log(message) {
    if (!this.config.debug) return
    console.log('[Trello Design] ' + message)
  }

  start() {
    this.config.updateId = setInterval(() => this.update(), this.config.updateInterval)
  }

  update() {
    // Trello Board Only
    if(!this.config.updatePath.test(window.location.pathname)) {
      return
    }

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

  updateCardNumber(card) {
    const badges = card.closest('.list-card').find('.badges')

    // No.が変更されることはないので追加済みなら処理しない
    const customBadges = badges.find('.js-td-badges')
    if (!!customBadges.length) {
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

    const intervalChanged = (!!options.updateInterval && this.config.updateInterval !== options.updateInterval)
    this.config = Object.assign(this.config, options)
    if(intervalChanged) {
      this.log('intervalChanged\n' + this.config.updateInterval)

      clearInterval(this.config.updateId)
      this.start()
    }
  }
}

$(() => {
  chrome.storage.local.set({defaults: defaults})
  chrome.storage.local.get('options', (result) => {
    const options = result.options
    window.trelloDesign = new Application(options)
    window.trelloDesign.start()
  })
})
