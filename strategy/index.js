/*
 * @Author: lip.fan
 * @Date: 2018-04-15 15:23:29
 * @Last Modified by: lip.fan
 * @Last Modified time: 2018-04-15 15:58:57
 */

// 策略对象集合
var strategies = {
  isNoEmpty: function(value, msg) {
    if (value === '') {
      return msg
    }
  },
  minLength: function(value, len, msg) {
    if (value.length < len) {
      return msg
    }
  },
  isMobile: function(value, msg) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
      return msg
    }
  }
}

var Validator = function() {
  this.cache = []
}
Validator.prototype.add = function(dom, rules) {
  let self = this
  for (let i = 0, l = rules.length; i < l; ++i) {
    ;(function(rule) {
      var strategyAry = rule.strategy.split(':')
      var msg = rule.msg

      self.cache.push(function() {
        let strategy = strategyAry.shift()
        strategyAry.unshift(dom.value)
        strategyAry.push(msg)
        return strategies[strategy].apply(dom, strategyAry)
      })
    })(rules[i])
  }
}

Validator.prototype.start = function() {
  for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var errorMsg = validatorFunc()
    if (errorMsg) {
      return errorMsg
    }
  }
}
