---
title: "nodeJS CLI Tool With Example Make Module"
date: 2018-05-17T02:45:51.000Z
tags: [nodejs]
categories: [nodejs]
---

## TECHNIQUE

1.  commander (npm install commander –save-dev)
2.  [singleton pattern](/2018/05/08/design-pattern-singleton-pattern/)
3.  fs to create and remove file

## CODE

```js
#!/usr/bin/env node

/**
 * author: ANPH
 * create & destroy Module
 * usage: [
 *          0. `piepme-express` shell script now ready with `npm link at begin`
 *          1. npm install commander [--save-dev] at begin
 *          2. create module: node mk-module -c(--create) <moduleName>
 *          2. destroy module: node mk-module -d(--destroy) <moduleName>
 *        ]
 * notice: be careful thinking before hitting enter, there is no way back from future
 */

const ph4n4nTool = (() => {
  let instance;
  init = () => {
    const fs = require("fs"),
      //
      TAG_RMV = "<REMOVE ME AT BEGIN FB1D2631C12FE8F7EE8951663A8A1081>",
      //STAT
      NOT_FOUND = "NOT_FOUND",
      DENIED = "DENIED",
      EXISTED = "EXISTED",
      //CONST name
      CONTROLLER = "controller",
      MODEL = "model",
      CLIENTJS = "clientJS",
      CSS = "css",
      V_FOLDER = "viewfolder",
      VIEW = "view",
      ROUTER = "router",
      // DEFINE STRUCTURE FOLDER
      _getModuleInfo = (mdlName) => {
        return {
          [CONTROLLER]: `./server/controllers/${mdlName}.js`,
          [MODEL]: `./server/model/${mdlName}Model.js`,
          [CLIENTJS]: `./client/js/dev/modules.${mdlName}.js`,
          [CSS]: `./client/css/dev/${mdlName}.css`,
          [V_FOLDER]: `./views/${mdlName}`,
          [VIEW]: `./views/${mdlName}/${mdlName}_view.ejs`,
          [ROUTER]: `./server/router/r${mdlName}.js`,
        };
      },
      //get message with exactly case
      _getMessage = (tag, path) =>
        tag === NOT_FOUND
          ? `FILE NOT FOUND: ${path}`
          : tag === DENIED
            ? `ACCESS  DENIED: ${path}`
            : tag === EXISTED
              ? `OPPS!  EXISTED: ${path}`
              : "",
      //pad number < 10 left
      padLeft = (num) => (+num < 10 ? "0" + num : num),
      //
      toCapilalize = (lower) => lower.charAt(0).toUpperCase() + lower.substr(1),
      //
      _getCreatedDate = () => {
        let date = new Date(); //+ 7 in hour -> GMT +7
        date = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        return `${padLeft(date.getDate())}/${padLeft(date.getMonth() + 1)}/${date.getFullYear()} ${padLeft(date.getHours() + 7)}:${padLeft(date.getMinutes())}:${padLeft(date.getSeconds())}`;
      },
      //header comment
      _getModuleDescription = (mdlName, particularName) =>
        [CSS, VIEW].indexOf(particularName) > -1
          ? TAG_RMV
          : `${TAG_RMV}
        /* 
        * Author: ${require("os").userInfo().username.toLocaleUpperCase()}
        * Create: ${_getCreatedDate()}
        * ${mdlName.toUpperCase()} ${particularName.toUpperCase()}
        */`,
      //template string of sample code
      _sampleCode = (mdlName) => {
        return {
          [CONTROLLER]: `const ${toCapilalize(mdlName)}Model = require('../model/${mdlName}Model')
            module.exports = class ${toCapilalize(mdlName)} extends PIEPME {
              constructor() {
                super()
                this.affModel = new ${toCapilalize(mdlName)}Model()
              }
              _${mdlName} (req, res){ }
            }`,
          [MODEL]: `module.exports = class ${toCapilalize(mdlName)}Model {
              constructor() { this.webServ = new Service() }
            }`,
          [CLIENTJS]: `'use strict';
            window.onload = function () {//call method public here
              //${mdlName}Plugin.getInstance().fn();
            }
            var ${mdlName}Plugin = (function () {
              var instance;
              function init() {
                function eventListener() { }
                return {//what to public
                }
              }
              return {
                getInstance: function () {
                  if (!instance) //make sure only 1 object created
                    instance = init();
                  return instance;
                }
              }
            })();`,
          [CSS]: "",
          [VIEW]: `<%- include('../layout/header', { css: ['/css/${mdlName}.css'] }); %>

          <%- include('../layout/footer'); %>
          <script src="/js/modules.${mdlName}.js"></script>`,
          router: `const ${toCapilalize(mdlName)} = require('../controllers/voucher')
            module.exports = function (app) {
            this.ctrl${toCapilalize(mdlName)} = new ${toCapilalize(mdlName)} ()
            app.get('/${mdlName}', (req, res) => this.ctrl${toCapilalize(mdlName)}._${mdlName}(req, res))
          }`,
        };
      },
      //
      _checkTagRmv = (path) =>
        !fs.existsSync(path)
          ? NOT_FOUND
          : fs.readFileSync(path).toString("utf-8").split("\n")[0].trim() ===
              TAG_RMV
            ? true
            : DENIED,
      //create 1 file with required
      _generateFile = (mdlName, path, keySample, fpath) => {
        !!fpath && !fs.existsSync(fpath) && fs.mkdirSync(fpath);

        if (!fs.existsSync(path)) {
          fs.writeFileSync(
            path,
            `${_getModuleDescription(mdlName, keySample)}
          ${_sampleCode(mdlName)[keySample]}`,
          );
          return path;
        } else return _getMessage(EXISTED, path);
      },
      //remove 1 file from xpath
      _destroyFromPath = (xpath, folder) => {
        const canRemove = _checkTagRmv(xpath);
        if (+canRemove) {
          fs.unlinkSync(xpath);
          !!folder && fs.rmdirSync(folder);
          return xpath;
        } else return _getMessage(canRemove, xpath);
      },
      //create file follow defined structure
      _makeModule = (mdlName) => {
        const path = _getModuleInfo(mdlName);
        return [
          _generateFile(mdlName, path[CONTROLLER], CONTROLLER),
          _generateFile(mdlName, path[MODEL], MODEL),
          _generateFile(mdlName, path[CLIENTJS], CLIENTJS),
          _generateFile(mdlName, path[CSS], CSS),
          _generateFile(mdlName, path[ROUTER], ROUTER),
          _generateFile(mdlName, path[VIEW], VIEW, path[V_FOLDER]),
        ];
      },
      //remove all file
      _destroyModule = (mdlName) => {
        const path = _getModuleInfo(mdlName);
        return [
          _destroyFromPath(path[CONTROLLER]),
          _destroyFromPath(path[MODEL]),
          _destroyFromPath(path[CLIENTJS]),
          _destroyFromPath(path[CSS]),
          _destroyFromPath(path[ROUTER]),
          _destroyFromPath(path[VIEW], path[V_FOLDER]),
        ];
      };
    //public only 2 main function
    return { _makeModule, _destroyModule };
  };
  return {
    getInstance: () => {
      if (!instance) instance = init();
      return instance;
    },
  };
})();
```

## USING

```js
const anphTool = ph4n4nTool.getInstance(),
  commander = require("commander");

commander
  .version("1.0.0", "-v, --version")
  .option("-c, --create [value]", "create module by name", anphTool._makeModule)
  .option(
    "-d, --destroy [value]",
    "destroy module by name",
    anphTool._destroyModule,
  )
  .parse(process.argv);

!!create &&
  console.log(" -- CREATED:\n\n\t%s\n\n -> successfully!", create.join("\n\t"));
!!destroy &&
  console.log(
    " -- DESTROYED:\n\n\t%s\n\n -> successfully!",
    destroy.join("\n\t"),
  );
```
