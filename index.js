/*

By default, the first arg of every fn in the list will be a function you can
use to call the next function in the list:

    var f = chain(
      [ function(next, arr) { arr.push('a') ; next(arr) }
      , function(next, arr) { arr.push('b') ; next(arr) }
      ])
    f([]) // => ['a','b']

You can also pass 'bound' as the second arg to use `this.next()` to invoke the
next function in the list:

    var f = chain(
      [ function(arr) { arr.push('a') ; this.next(arr) }
      , function(arr) { arr.push('b') ; this.next(arr) }
      ])
    f([]) // => ['a','b']

*/

var ns = module.exports = function(fns, mode) {
  mode = mode || 'arg'
  switch (mode) {
    case 'arg':   return ns.arg(fns)
    case 'bound': return ns.bound(fns)
    default: throw new Error(mode + ' is not a valid mode')
  }
}

// From an array of functions return a function that is the first element of
// the array with its `this` bound to an object who's `next` property is
// the second function of the array with its bound to an object who's `next`
// property is the third function in the array ... etc
ns.bound = function(fns){
  this._validateArgs(fns)

  var head = fns[0]
    , rest = fns.slice(1)
    , recurse = this.bound.bind(this)
    , done = this.done

  if (1 === fns.length) return head.bind({ next: done })
  return head.bind({ next: recurse(rest) })
}

// From an array of functions (where the first arg of each function is a "next"
// function) produces a single function that when invoked will invoke the
// first function in the array passing a function that will invoke the second
// function in the array (... etc) as the "next" argument
ns.arg = function(fns) {
  this._validateArgs(fns)

  var head = fns[0]
    , rest = fns.slice(1)
    , recurse = this.arg.bind(this)
    , done = this.done

  if (0 === rest.length)
    return function() { head.bind(null,done).apply(null,arguments) }
  return function() {
    head.bind(null,recurse(rest)).apply(null,arguments)
  }
}

// The value of "next" for the last function in the chain
ns.done = function(){}

// Args must be a non-empty array
ns._validateArgs = function(fns) {
  if (!( fns && fns.length && fns.length !== 0 ))
    throw new Error("Argument must be an array of functions")
}
