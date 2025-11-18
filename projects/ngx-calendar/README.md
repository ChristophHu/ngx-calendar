# Ngx-code-representation

## Demo
<p align="center">
  <a href="https://christophhu.github.io/ngx-calendar"><img src="https://github.com/ChristophHu/ChristophHu/blob/main/assets/img/ngx-calendar.png" width="500" alt="image" /></a>
</p>

## Description
This repository contains an Angular 20 demo that showcases the `ngx-calendar` library. The demo demonstrates various features and functionalities of the `ngx-calendar` component, allowing users to explore its capabilities in a practical setting.

## Frameworks and Languages
<p align="left">
  <img alt="Static Badge" src="https://img.shields.io/badge/20.3.0-000000?style=for-the-badge&logo=angular&logoColor=white&label=Angular&labelColor=000000">
  <img alt="Static Badge" src="https://img.shields.io/badge/4.1.17-000000?style=for-the-badge&logo=tailwindcss&logoColor=white&label=TailwindCSS&labelColor=06B6D4&color=000000">
  <img alt="Static Badge" src="https://img.shields.io/badge/5.9.2-000000?style=for-the-badge&logo=typescript&logoColor=white&label=Typescript&labelColor=007ACC&color=000000">
</p>


## Installation
To run this project, you need to have Node.js installed on your machine. Clone the repository and run the following commands:

```bash
npm install @christophhu/ngx-calendar
```

## Usage
Import the DatatableComponent in the app.ts.

```typescript
import { NgxCodeRepresentationComponent } from '@christophhu/ngx-code-representation';

@NgModule({
    imports: [
        NgxCodeRepresentationComponent,
        ...
    ]
...
})
```

```typescript
export class App {
  constructor(private _ngxCodeRepresentationService: NgxCodeRepresentationService, private _ngxCodeThemesService: NgxCodeThemesService) {
    this._ngxCodeRepresentationService.setGist(this.gist)
    this._ngxCodeThemesService.setThemes([
      'assets/highlight_themes/github-dark.css',
      'assets/highlight_themes/dark.css',
      'assets/highlight_themes/github.css'
    ])
  }

  gist: gist = {
    "name": "border-blob",
    "type": "shape",
    "version": "1.0.0",
    "description": "A blob shape with a border",
    "file": [
      {
        "filename": "border-blob.html",
        "language": "html",
        "code": "<div class=\"card\">\n<div class=\"bg\">\n<\/div>\n<div class=\"blob\"><\/div></div>"
      },
      {
        "filename": "border-blob.css",
        "language": "css",
        "code": ".card {\r\n  position: relative;\r\n  width: 200px;\r\n  height: 250px;\r\n  border-radius: 14px;\r\n  z-index: 1111;\r\n  overflow: hidden;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;\r\n  ;\r\n}\r\n\r\n.bg {\r\n  position: absolute;\r\n  top: 5px;\r\n  left: 5px;\r\n  width: 190px;\r\n  height: 240px;\r\n  z-index: 2;\r\n  background: rgba(255, 255, 255, .95);\r\n  backdrop-filter: blur(24px);\r\n  border-radius: 10px;\r\n  overflow: hidden;\r\n  outline: 2px solid white;\r\n}\r\n\r\n.blob {\r\n  position: absolute;\r\n  z-index: 1;\r\n  top: 50%;\r\n  left: 50%;\r\n  width: 150px;\r\n  height: 150px;\r\n  border-radius: 50%;\r\n  background-color: #ff0000;\r\n  opacity: 1;\r\n  filter: blur(12px);\r\n  animation: blob-bounce 5s infinite ease;\r\n}\r\n\r\n@keyframes blob-bounce {\r\n  0% {\r\n    transform: translate(-100%, -100%) translate3d(0, 0, 0);\r\n  }\r\n\r\n  25% {\r\n    transform: translate(-100%, -100%) translate3d(100%, 0, 0);\r\n  }\r\n\r\n  50% {\r\n    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);\r\n  }\r\n\r\n  75% {\r\n    transform: translate(-100%, -100%) translate3d(0, 100%, 0);\r\n  }\r\n\r\n  100% {\r\n    transform: translate(-100%, -100%) translate3d(0, 0, 0);\r\n  }\r\n}\r\n"
      }
    ],
    "image_base64": "..."
  }
}
```

Then, you can use the `<ngx-code-representation>` component in your HTML templates as shown below:
```html
<div class="relative h-96 m-4 rounded shadow-lg overflow-hidden">
  <ngx-code-representation></ngx-code-representation>
</div>
```

In der `index.html` Datei, fügen Sie die Highlight.js CSS und JS Dateien hinzu:
```html
!doctype html>
<html lang="en">
<head>
  ...
  <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/github-dark.min.css" />
  <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/highlight.min.js"></script>
</head>
...
</html>
```

```typescript
import { provideHighlightOptions } from 'ngx-highlightjs'
import { provideHttpClient } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml')
      },
      // https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/
      themePath: 'assets/style/github-dark.css'
    }),
    provideHttpClient()
  ]
};
```
## License
This project is licensed under the MIT License.

The MIT License (MIT)
Copyright © 2025 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
