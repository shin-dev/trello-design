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
      windowSizeMax: 960,
      lineHeight: 20,
      blankLineHeight: 16,
      copyButtonEnabled: true
    }
  }

  constructor(options = {}) {
    const defaults = Application.createDefaultOptions()
    this.config = Object.assign({}, defaults, options)

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

  // 有効なURLか
  // (ボードのみ更新処理を有効にするための判定)
  //
  // e.g.
  //   CardList (https://trello.com/b/*)
  //   CardDetail (https://trello.com/c/*)
  //
  // @return {Boolean}
  isValidLocation() {
    return /^\/[bc]\//.test(window.location.pathname)
  }

  // @return {Boolean}
  isBoardLocation() {
    return /^\/[b]\//.test(window.location.pathname)
  }

  // @return {Boolean}
  isCardLocation() {
    return /^\/[c]\//.test(window.location.pathname)
  }

  start() {
    this.update()
    this.updateId = setInterval(() => this.update(), this.config.updateInterval)
  }

  update() {
    // Trello Board Only
    if (!this.isValidLocation()) {
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

    this.updateCardNumberOnCardLocation()
    this.updateCopyButtonOnCardLocation()
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
        .window .window-main-col {
          width: calc(80% - 32px) !important;
          margin: 0 !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .window .window-sidebar {
          width: calc(20% - 32px) !important;
          margin: 0 !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .window .current.markeddown > *,
        .window .action-comment.markeddown current-comment > * {
          line-height: ${this.config.lineHeight}px;
        }
        .window .current.markeddown > *:not(:last-child),
        .window .action-comment.markeddown .current-comment > *:not(:last-child) {
          margin-bottom: ${this.config.blankLineHeight}px;
        }
      `
    }
    style.html(css)
  }

  updateCardNumber(card) {
    const badges = card.closest('.list-card').find('.badges')

    // No.が変更されることはないので追加済みなら処理を行わない
    const className = 'js-td-badges'
    const customBadges = badges.find(`.${className}`)
    if (customBadges.length) {
      if (!this.config.cardNumberEnabled) {
        customBadges.remove()
      }
      return
    }
    if (!this.config.cardNumberEnabled) {
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
    badges.prepend(`
      <span class="td-badges ${className}">
        <span>
          <div class="td-badges__badge">
            <span class="td-badges__badge-text">
              No. ${id}
            </span>
          </div>
        </span>
      </span>
    `)
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

  updateCardNumberOnCardLocation() {
    if (!this.isCardLocation()) {
      return
    }

    const parent = $('.js-card-detail-header')

    // No.が変更されることはないので追加済みなら処理を行わない
    const className = 'js-td-card-detail-badges'
    const customBadges = parent.find(`.${className}`)
    if (customBadges.length) {
      if (!this.config.cardNumberEnabled) {
        customBadges.remove()
      }
      return
    }
    if (!this.config.cardNumberEnabled) {
      return
    }

    // idを取得 (locationから取得)
    //
    // WARNING:
    //   取得できない場合があるのでその場合は次回更新時に回す
    //
    // e.g. url = "/c/abc123/45-no45-XXXX"
    const url = window.location.pathname
    if (!url) {
      return
    }
    const urlTokens = url.split('/')
    if (urlTokens.length < 3) {
      return
    }
    const pathname = urlTokens.pop()
    const id = pathname.split('-')[0]

    // 要素を追加
    // (Power-Upは`js-plugin-badges`という名前なので被らないようにする)
    parent.append(`
      <div class="td-card-detail-badges ${className}">
        <div class="td-card-detail-badges__badge">
          <span class="td-card-detail-badges__badge-text">
            No. ${id}
          </span>
        </div>
      </div>
    `)
  }

  updateCopyButtonOnCardLocation() {
    if (!this.isCardLocation()) {
      return
    }

    const parent = $('.js-card-detail-header')

    // No.が変更されることはないので追加済みなら処理を行わない
    const className = 'js-td-card-detail-copy-buttons'
    const target = parent.find(`.${className}`)
    if (target.length) {
      if (!this.config.copyButtonEnabled) {
        target.remove()
      }
      return
    }
    if (!this.config.copyButtonEnabled) {
      return
    }

    // idを取得 (locationから取得)
    //
    // WARNING:
    //   取得できない場合があるのでその場合は次回更新時に回す
    //
    // e.g. url = "/c/abc123/45-no45-XXXX"
    const url = window.location.pathname
    if (!url) {
      return
    }
    const urlTokens = url.split('/')
    if (urlTokens.length < 3) {
      return
    }
    // 共有リンクの取得 (末尾のタイトルは不要なので除外したURLを返す)
    const idAndTitle = urlTokens.pop()
    const linkPath = url.replace(new RegExp(`/${idAndTitle}$`), '')
    const linkURL = `https://trello.com${linkPath}`
    // タイトルはヘッダーから取得
    const title = $('.js-title-helper').text()

    // 要素を追加
    // (Power-Upは`js-plugin-badges`という名前なので被らないようにする)
    parent.append(`
      <div class="td-card-detail-buttons ${className}">
        <div class="td-card-detail-buttons__child" data-copied="false">
          <button class="td-card-detail-buttons__button js-copy" data-content="${linkURL}">
            Copy Link
          </button>
          <button class="td-card-detail-buttons__button" style="color:green">
            Copied!
          </button>
        </div>
        <div class="td-card-detail-buttons__child" data-copied="false">
          <button class="td-card-detail-buttons__button js-copy" data-content="${title}">
            Copy Title
          </button>
          <button class="td-card-detail-buttons__button" style="color:green">
            Copied!
          </button>
        </div>
      </div>
    `)
    parent.find(`.${className}`).on('click', '.js-copy', (e) => {
      const element = $(e.target)
      const parent = element.parent()
      const content = element.data('content')

      const clipboard = $('<textarea></textarea>')
      clipboard.val(content)
      $('body').append(clipboard)

      clipboard.select()
      document.execCommand('copy')
      clipboard.remove()

      parent.data('copied', 'true')
      parent.attr('data-copied', 'true')
      setTimeout(() => {
        parent.data('copied', 'false')
        parent.attr('data-copied', 'false')
      }, 700)
    })
  }

  // popup.jsからのコールバック
  refresh(options) {
    this.log('refresh\n' + JSON.stringify(options))

    const intervalChanged = (options.updateInterval != null && this.config.updateInterval !== options.updateInterval)
    const styleChanged = (
      (options.cardCoverEnabled != null && this.config.cardCoverEnabled !== options.cardCoverEnabled) ||
      (options.windowSizeAdjustment != null && this.config.windowSizeAdjustment !== options.windowSizeAdjustment) ||
      (options.windowSize != null && this.config.windowSize !== options.windowSize) ||
      (options.windowSizeMax != null && this.config.windowSizeMax !== options.windowSizeMax) ||
      (options.lineHeight != null && this.config.lineHeight !== options.lineHeight) ||
      (options.blankLineHeight != null && this.config.blankLineHeight !== options.blankLineHeight)
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
