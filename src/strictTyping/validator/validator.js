var lodash = require('lodash');
var evaluate = require('static-eval');
var esprima = require('esprima');

module.exports.validate = function(properties, object) {
  var keys = Object.keys(properties);
  keys.forEach(function(key) {
    var property = properties[key];

    if (lodash.isUndefined(object[property.name]) && property.required === true) {
      throw 'Required property "' + property.name + '" is not present';
    }

    switch(property.withType) {
      case 'object':
      break;
      case 'array':
      break;
      case 'string':
        if (property.matchingPattern) {
          var string = object[property.name];
          if (string.search(property.matchingPattern) < 0 ) {
            throw 'String property "' + property.name + '" does not match pattern "' + property.matchingPattern + '". Property value was ' + string;
          }
        }
      break;
      case 'conditionalExpressionString':
        var conditionalExpression = object[property.name];
        if (lodash.isEmpty(conditionalExpression) || !lodash.isString(conditionalExpression)) {
          throw 'Conditional expression "' + property.name + '" must be a non-empty string';
        }

        var parse;
        try {
          parse = esprima.parse(conditionalExpression);
        } catch (exception) {
          throw "Failed to parse conditional expression. Esprima parse error: " + exception;
        }

        if (parse.body.length > 1) {
          throw 'Conditional expression string "' + property.name + '" must be a single conditional expression, but ' + parse.body.length + ' expressions ' +
            ' were found. The expression is: ' + conditionalExpression;
        }

        var parsedExpression = parse.body[0];
        if (parsedExpression.type !== 'ExpressionStatement') {
          throw 'Conditional expression string "' + property.name + '" must be a boolean expression, but it was a "' + parsedExpression.type + '". The ' +
            'expression is: ' + conditionalExpression;
        }
      break;
      case 'function':
      break;
    }
  });
}