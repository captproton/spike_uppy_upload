// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import "@hotwired/turbo-rails"
require("@rails/activestorage").start()
//require("trix")
//require("@rails/actiontext")
require("local-time").start()
require("@rails/ujs").start()

import './channels/**/*_channel.js'
import "./controllers"

import * as bootstrap from "bootstrap"

document.addEventListener("turbo:load", () => {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
})

// start uppy code
// const Uppy = require('@uppy/core')
import Uppy from '@uppy/core'
// const Dashboard = require('@uppy/dashboard')
import Dashboard from '@uppy/dashboard'
// const ActiveStorageUpload = require('@excid3/uppy-activestorage-upload')
import ActiveStorageUpload from '@excid3/uppy-activestorage-upload'

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-uppy]').forEach(element => setupUppy(element))
})

function setupUppy(element) {
  let trigger = element.querySelector('[data-behavior="uppy-trigger"]')
  let form = element.closest('form')
  let direct_upload_url = document.querySelector("meta[name='direct-upload-url']").getAttribute("content")
  let field_name = element.dataset.uppy

  trigger.addEventListener("click", (event) => event.preventDefault())

  const uppy = new Uppy(
      {
        autoProceed: true,
        allowMultipleUploads: false,
        debug: true,
        logger: Uppy.debugLogger
      }
    )  

    uppy.use(ActiveStorageUpload, {
    directUploadUrl: direct_upload_url
  })

  uppy.use(Dashboard, {
    trigger: trigger,
    closeAfterFinish: true,
  })

  uppy.on('complete', (result) => {
    // Rails.ajax
    // or show a preview:
    element.querySelectorAll('[data-pending-upload]').forEach(element => element.parentNode.removeChild(element))

    result.successful.forEach(file => {
      appendUploadedFile(element, file, field_name)
      setPreview(element, file)
    })

    uppy.reset()
  })
}

function appendUploadedFile(element, file, field_name) {
  const hiddenField = document.createElement('input')

  hiddenField.setAttribute('type', 'hidden')
  hiddenField.setAttribute('name', field_name)
  hiddenField.setAttribute('data-pending-upload', true)
  hiddenField.setAttribute('value', file.response.signed_id)

  element.appendChild(hiddenField)
}

function setPreview(element, file) {
  let preview = element.querySelector('[data-behavior="uppy-preview"]')
  if (preview) {
    let src = (file.preview) ? file.preview : "/images_placeholder.png"
    preview.src = src
  }
}