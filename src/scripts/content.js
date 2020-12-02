/*
 * © 2020 シン合同会社 - SHIN LLC
 * https://shin-dev.com
 */
import $ from 'jquery'
import { Application } from './contents/application'

$(() => {
  const defaults = Application.createDefaultOptions()
  chrome.storage.local.set({defaults: defaults}, () => {
    chrome.storage.local.get(null, (result) => {
      const options = result.options
      window.trelloDesign = new Application(options)
      window.trelloDesign.start()
    })
  })
})
