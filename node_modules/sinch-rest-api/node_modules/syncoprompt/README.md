# Syncoprompt

minimalist zero-dependency cross-platform synchronous prompting module

## API

```js
require('syncoprompt') => (question = '', opts = {hidden: false, echo: '*'}) => String => answer
```

## Usage
```js
var prompt = require('syncoprompt')

var name = prompt('Tell us yer name then: ')
var pwd = prompt('Password: ', {hidden: true, echo: '#'})

console.log('How do ya do', name, 'your password is', pwd)
```

## Options

`hidden`: Default is `false`. This prevents echo-back during text entry

`echo`: Default is `'*'`. Echo character to be used when hidden. For no echo set this to `''`

## Credits

* [prompt-sync](http://github.com/0xxff/prompt-sync) for code and inspiration
* Sponsored by [nearForm](http://nearform.com)