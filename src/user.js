/*
 * © 2020 シン合同会社 - SHIN LLC
 * https://shin-dev.com
 */

// メイン処理
$(function () {
  var config = {
    debug: false,
    initId: null,
    initTime: 5000,
    refreshId: null,
    refreshTime: 1000,
    refreshEnable: true,
    cardColor: {
      transparent: 0.7
    },
    cache: {
      cards: [],
      cardLabels: []
    }
  };

  function log(message) {
    if (config.debug) {
      console.log('[Trello Design] ' + message);
    }
  }

  function refreshCard(card) {
    // Card Number
    // .badgesが末尾にある親要素
    var badges = card.closest('.list-card').find('.badges');
    // 要素を取得 (ちなみにPower-Upは`js-plugin-badges`という名前)
    var customBadges = badges.find('.js-td-badges');
    if (!!customBadges.length) {
      return;
    }

    // idを取得 (hrefから取得)
    // e.g. href="/c/abc123/45-no45-XXXX"
    var url = card.attr('href');
    if (!url) {
      return;
    }
    var pathname = url.split('/').pop();
    var id = pathname.split('-')[0];
    // log('id: ' + id);

    // 要素を追加
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
    );
  }

  function refreshCardLabel(cardLabel) {
    // Card Color
    var backgroundColor = cardLabel.css('background-color');
    if (!backgroundColor) {
      return;
    }

    var backgroundColorRGB = backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    if (!backgroundColorRGB || backgroundColorRGB.length !== 4) {
      return;
    }

    var cssColor = 'rgba(' +
      backgroundColorRGB[1] + ',' +
      backgroundColorRGB[2] + ',' +
      backgroundColorRGB[3] + ',' +
      config.cardColor.transparent + '' +
      ')';
    cardLabel.closest('.list-card').css({'background-color': cssColor});
    // log('cssColor: ' + cssColor);
  }

  function refresh(caching = false) {
    log('refresh');
    var i = 0, j = 0;
    var cache = null, findCache = false;

    // Cards
    var cards = $('.list-card');
    var cardCache = [];
    var updateCardCache = false;
    for (i = 0; i < cards.length; i++) {
      var card = $(cards[i]);
      cardCache.push(card);

      // キャッシュ比較
      findCache = false;
      for (j = 0; j < config.cache.cards.length; j++) {
        cache = config.cache.cards[j];
        if (card.is(cache)) {
          findCache = true;
          break;
        }
      }
      if (findCache) {
        continue;
      }

      // 更新
      refreshCard(card);
      updateCardCache = true;
    }
    if (caching && updateCardCache) {
      config.cache.cards = cardCache;
    }

    // CardLabels
    var cardLabels = $('.card-label');
    var cardLabelCache = [];
    var updateCardListCache = false;
    for (i = 0; i < cardLabels.length; i++) {
      var cardLabel = $(cardLabels[i]);
      cardLabelCache.push(cardLabel);

      // キャッシュ比較
      findCache = false;
      for (j = 0; j < config.cache.cardLabels.length; j++) {
        cache = config.cache.cardLabels[j];
        if (cardLabel.is(cache)) {
          findCache = true;
          break;
        }
      }
      if (findCache) {
        continue;
      }

      // 更新
      refreshCardLabel(cardLabel);
      updateCardListCache = true;
    }
    if (caching && updateCardListCache) {
      config.cache.cardLabels = cardLabelCache;
      log('refreshCardLabels');
    }
  }

  // 初期化(カードが非同期読み込みなので遅延させる必要がある)
  config.initId = setInterval(function () {
    log('Hello Plug-in!');
    // 初期化
    refresh(true);
    // ループ設定
    if (config.refreshEnable) {
      config.refreshId = setInterval(function () {
        refresh();
      }, config.refreshTime);
    }
    // 初期化終了
    clearInterval(config.initId);
  }, config.initTime);
}); // $(function() {})
