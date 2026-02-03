---
title: "Paste Html to Div(contentediable)"
date: 2018-05-25T03:13:23.000Z
tags: [javascript]
categories: [javascript]
---

## HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
<div contenteditable="true" id="anph">
  
  
  
</div>
</body>
</html>
```

## JS

```js
function cleanWordPaste( in_word_text ) {
 var tmp = document.createElement("DIV");
 tmp.innerHTML = in_word_text;
 var newString = tmp.textContent||tmp.innerText;
 // this next piece converts line breaks into break tags
 // and removes the seemingly endless crap code
 newString  = newString.replace(/\n\n/g, "<br />").replace(/.*<!--.*-->/g,"");
 // this next piece removes any break tags (up to 10) at beginning
 for ( i=0; i<10; i++ ) {
  if ( newString.substr(0,6)=="<br />" ) { 
   newString = newString.replace("<br />", ""); 
  }
 }
 return newString;
}

document.getElementById("anph").addEventListener("paste", function(evt){
  evt.preventDefault();
  this.innerText = cleanWordPaste(evt.clipboardData.getData('Text'));
  
});

```

## DEMO

[patse html](http://jsbin.com/caxasak/edit?html,js,console,output)