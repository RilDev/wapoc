const fs = require('fs')
const path = require('path')

module.exports = function customElementGenerator() {
  // get the template files paths
  const templatePath = path.join(process.cwd(), 'templates')
  const files = fs.readdirSync(templatePath)

  const elements = files.map(name => {
    const elementPath = path.join(templatePath, name)
    let elementName = name.split('.')
    elementName.pop()
    elementName = elementName.join('-')
    const elementContent = fs.readFileSync(elementPath)
    return ({
    name: elementName + "-template",
    content: elementContent.toString()
  })})

  // return a string to inject into served page
  return `
  (() => {
    const elements = ${JSON.stringify(elements)}

    for (element of elements) {
      const template = document.createElement('template');
      template.innerHTML = element.content


      customElements.define(element.name, class extends HTMLElement {
        constructor() {
          super()
        }

        connectedCallback() {
          const shadowRoot = this.attachShadow({ mode: 'open' })
          shadowRoot.appendChild(template.content.cloneNode(true))
        }
      })
    }
  })()
`
}
