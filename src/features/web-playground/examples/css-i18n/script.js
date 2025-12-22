function setLang(code) {
// Just change the lang attribute on the container
// CSS handles the text replacement! 🤯
document.querySelector('.container').setAttribute('lang', code);
console.log('Language switched to:', code);
}