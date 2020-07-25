window.onload = () => {
  chrome.storage.local.get(['defaults', 'options'], (result) => {
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
      if(value === Number.NaN) {
        target.value = defaultValue
      }
      else if(value < min) {
        target.value = min
      }
      else if(value > max) {
        target.value = max
      }
    }

    // Initialize
    const optionKeys = [
      'updateInterval',
      'cardColorEnabled',
      'cardColorOpacity',
      'cardNumberEnabled'
    ]
    const config = Object.assign(result.defaults, result.options)
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
    const reset = document.getElementById('reset')
    function apply() {
      updateInterval.value = options.updateInterval
      cardColorEnabled.checked = options.cardColorEnabled
      cardColorOpacity.value = options.cardColorOpacity
      cardNumberEnabled.checked = options.cardNumberEnabled
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
    reset.onclick = () => {
      if(window.confirm('Are you sure?')) {
        options = Object.assign({}, defaults)
        apply()
        refresh()
      }
    }
  })
}
