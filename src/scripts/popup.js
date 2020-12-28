/*
 * © 2020 シン合同会社 - SHIN LLC
 * https://shin-dev.com
 */
window.onload = () => {
  // Initialize
  const links = document.getElementsByTagName('a')
  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    const location = link.href
    link.onclick = function () {
      chrome.tabs.create({active: true, url: location})
    }
  }

  // Inactive / Active
  const inactiveContents = document.getElementById('js-inactive-contents')
  const activeContents = document.getElementById('js-active-contents')
  chrome.tabs.getSelected(null, function(tab) {
    if (tab == null || !tab.url || tab.url.indexOf('https://trello.com') !== 0) {
      // Inactive
      activeContents.style.display = 'none'
      inactiveContents.style.display = 'block'
    } else {
      // Active
      activeContents.style.display = 'block'
      inactiveContents.style.display = 'none'

      // Initialize
      chrome.storage.local.get(null, (result) => {
        // failsafe
        if (result == null) {
          return
        }

        function refresh() {
          chrome.storage.local.set({options: options})
          chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.executeScript(
              tabs[0].id,
              {code: `window.trelloDesign.refresh(${JSON.stringify(options)})`}
            )
          })
        }

        function validateNumber(element, defaultValue) {
          const target = element.target
          const min = Number(target.min)
          const max = Number(target.max)
          const value = Number(target.value)
          if (value === Number.NaN) {
            target.value = defaultValue
          }
          else if (value < min) {
            target.value = min
          }
          else if (value > max) {
            target.value = max
          }
        }

        const optionKeys = [
          'updateInterval',
          'cardColorEnabled',
          'cardColorOpacity',
          'cardNumberEnabled',
          'cardCoverEnabled',
          'windowSizeAdjustment',
          'windowSize',
          'windowSizeMax',
          'lineHeight',
          'blankLineHeight',
          'copyButtonEnabled'
        ]
        const config = Object.assign({}, result.defaults, result.options)
        const defaults = {}
        let options = {}
        optionKeys.forEach(key => {
          defaults[key] = result.defaults[key]
          options[key] = config[key]
        })
        const updateInterval = document.getElementById('updateInterval')
        const cardColorEnabled = document.getElementById('cardColorEnabled')
        const cardColorOpacity = document.getElementById('cardColorOpacity')
        const cardNumberEnabled = document.getElementById('cardNumberEnabled')
        const cardCoverEnabled = document.getElementById('cardCoverEnabled')
        const windowSizeAdjustment = document.getElementById('windowSizeAdjustment')
        const windowSize = document.getElementById('windowSize')
        const windowSizeMax = document.getElementById('windowSizeMax')
        const lineHeight = document.getElementById('lineHeight')
        const blankLineHeight = document.getElementById('blankLineHeight')
        const copyButtonEnabled = document.getElementById('copyButtonEnabled')
        const reset = document.getElementById('reset')

        function apply() {
          updateInterval.value = options.updateInterval
          cardColorEnabled.checked = options.cardColorEnabled
          cardColorOpacity.value = options.cardColorOpacity
          cardNumberEnabled.checked = options.cardNumberEnabled
          cardCoverEnabled.checked = options.cardCoverEnabled
          windowSizeAdjustment.checked = options.windowSizeAdjustment
          windowSize.value = options.windowSize
          windowSizeMax.value = options.windowSizeMax
          lineHeight.value = options.lineHeight
          blankLineHeight.value = options.blankLineHeight
          copyButtonEnabled.checked = options.copyButtonEnabled
        }
        apply()

        // Callbacks
        updateInterval.onchange = (element) => {
          validateNumber(element, defaults['updateInterval'])
          options.updateInterval = element.target.value
          refresh()
        }
        cardColorEnabled.onchange = (element) => {
          options.cardColorEnabled = element.target.checked
          refresh()
        }
        cardColorOpacity.onchange = (element) => {
          validateNumber(element, defaults['cardColorOpacity'])
          options.cardColorOpacity = element.target.value
          refresh()
        }
        cardNumberEnabled.onchange = (element) => {
          options.cardNumberEnabled = element.target.checked
          refresh()
        }
        cardCoverEnabled.onchange = (element) => {
          options.cardCoverEnabled = element.target.checked
          refresh()
        }
        windowSizeAdjustment.onchange = (element) => {
          options.windowSizeAdjustment = element.target.checked
          refresh()
        }
        windowSize.onchange = (element) => {
          validateNumber(element, defaults['windowSize'])
          options.windowSize = element.target.value
          refresh()
        }
        windowSizeMax.onchange = (element) => {
          validateNumber(element, defaults['windowSizeMax'])
          options.windowSizeMax = element.target.value
          refresh()
        }
        lineHeight.onchange = (element) => {
          validateNumber(element, defaults['lineHeight'])
          options.lineHeight = element.target.value
          refresh()
        }
        blankLineHeight.onchange = (element) => {
          validateNumber(element, defaults['blankLineHeight'])
          options.blankLineHeight = element.target.value
          refresh()
        }
        copyButtonEnabled.onchange = (element) => {
          options.copyButtonEnabled = element.target.checked
          refresh()
        }
        reset.onclick = () => {
          if (window.confirm('Are you sure?')) {
            options = Object.assign({}, defaults)
            apply()
            refresh()
          }
        }
      })
    }
  })
}
