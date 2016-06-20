var fs = require('fs')

function prompt(question, opt) {
  
  opt = opt || {}
  var rawMode = process.stdin.isRaw
  var hidden = opt.hidden
  var echo = opt.echo || '*'
  var term = 13 // carriage return
  var insert = 0
  
  var fd = process.platform !== 'win32' && +process.version.substr(3) < 12 ? 
    fs.openSync('/dev/tty', 'rs') : 
    process.stdin.fd

  var buf = Buffer(3)
  var str = ''
  var char
  var read

  process.stdin.setRawMode(true)

  if (question) {
    insert = question.length
    process.stdout.write(question)
  }


  while (true) {
    read = fs.readSync(fd, buf, 0, 3)
    //process.stdout.write('read '+ read + ' '+ buf[0])
    if (read === 3) { // received a control sequence
      switch(buf.toString()) {
          case '\u001b[D': //left arrow
            if (hidden) break
            insert = (--insert < 0) ? 0 : insert
            process.stdout.write("\033[1D" +  '')
            break
          case '\u001b[C': //right arrow
            if (hidden) break
            insert = (++insert > str.length) ? str.length : insert
            process.stdout.write("\033[" + (insert + 1) + "G")
            break
      }
      continue // any other 3 character sequence is ignored
    }
    
    // if it is not a control character seq, assume only one character is read
    char = buf[read-1]
    
    // catch a ^C and return null
    if (char === 3){ 
      process.stdout.write('^C\n')
      fs.closeSync(fd)
      process.stdin.setRawMode(rawMode)
      process.exit(130)
    }

    // catch the terminating character
    if (char === term) {
      fs.closeSync(fd)
      break
    }
    
    if (char === 127) { //backspace
      if (!insert) continue
      str = str.slice(0, insert-1) + str.slice(insert)
      insert--
    } else {
      if ((char < 32 ) || (char > 126)) continue
      str = str.slice(0, insert) + String.fromCharCode(char) + str.slice(insert)
      insert++
    }
    
    if (hidden) {
      process.stdout.write("\033[2K\033[0G" + question + Array(str.length+1).join(echo))
      continue
    }
    if (insert === str.length) {
      process.stdout.write("\033[2K\033[0G"+ str)
      continue
    }

    process.stdout.write("\033[2K\033[0G"+ question + str)
  }
  
  process.stdout.write('\n')

  process.stdin.setRawMode(rawMode)
  
  return str
}


module.exports = prompt
prompt.prompt = prompt

