---
title: "Make Countdown Timer"
date: 2018-06-06T04:33:47.000Z
tags: [javascript]
categories: [javascript]
playground_slug: countdown
---

## HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Make countdown timer</title>
  </head>
  <body>
    <label id="anph" for=""></label>
  </body>
</html>
```

## JS

```js
//seconds in number -> toObj ? {h,m,s} : [hh:]mm:ss
function convertSecNoToHMS(seconds, toObj) {
  toObj = toObj || false
  seconds = ~~seconds
  var h = ~~(seconds / 3600),
    m = ~~((seconds % 3600) / 60),
    s = seconds - h * 3600 - m * 60
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  return toObj ? { h: h, m: m, s: s } : (+h ? h + ':' : '') + m + ':' + s;
}


function _createCountDownTimer(date, target) {
  date = ~~((+new Date(date) - +new Date()) / 1000);
 if(date>24*60*60)
   return false
   else
  var countDown = setInterval(function () {
    date--;
    target.innerHTML = convertSecNoToHMS(date);
    if (date === 0) clearInterval(countDown);
  }, 1000);
}


_createCountDownTimer('06 JUN 2018 12:00:00', anph)



_createCountDownTimer('2018-06-07T08:00:00.000Z', anph
```

## DEMO

[http://jsbin.com/nureboq/edit?js,console,output](http://jsbin.com/nureboq/edit?js,console,output)
