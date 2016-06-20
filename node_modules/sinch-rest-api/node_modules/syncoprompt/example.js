var prompt = require('./')

var name = prompt('Tell us yer name then: ')
var pwd = prompt('Password: ', {hidden: true, echo: '#'})

console.log('How do ya do', name, 'your password is', pwd)