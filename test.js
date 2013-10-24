var chain  = require('./')
  , assert = require('assert')

// can't chain empty array
assert.throws(function() { chain([]) })
// can't chain nothing
assert.throws(function() { chain() })

// Chain one function
var chainedFn = chain(
  [ function(x) { console.log(1); assert('x' === x); assert(chain.done === this.next) }
  ], 'bound')

chainedFn('x')

console.log('---')

// Two
var chainedFn = chain(
  [ function(x) {
      console.log(1); assert('x' === x); assert(this.next) ; this.next(x) }
  , function(x) {
      console.log(2); assert('x' === x); assert(chain.done === this.next) }
  ], 'bound')

chainedFn('x')

console.log('---')

// Three!
var chainedFn = chain(
  [ function(x) {
      console.log(1); assert('x' === x); assert(this.next) ; this.next(x) }
  , function(x) {
      console.log(2); assert('x' === x); assert(this.next) ; this.next(x) }
  , function(x) {
      console.log(3); assert('x' === x); assert(chain.done === this.next) }
  ], 'bound')

chainedFn('x')

console.log('---')

// Arg style

// Chain one function
var chainedFn = chain(
  [ function(next,x) { console.log(1); assert('x' === x); assert(chain.done === next) }
  ], 'arg')

chainedFn('x')

console.log('---')

// Two
var chainedFn = chain(
  [ function(next,x) { console.log(1); assert('x' === x); next(x) }
  , function(next,x) { console.log(2); assert('x' === x); assert(chain.done === next) }
  ], 'arg')

chainedFn('x')

console.log('---')

// Three
var chainedFn = chain(
  [ function(next,x) { console.log(1); assert('x' === x); next(x) }
  , function(next,x) { console.log(2); assert('x' === x); next(x) }
  , function(next,x) { console.log(3); assert('x' === x); assert(chain.done === next) }
  ], 'arg')

chainedFn('x')

console.log('---')

console.log('ok')
