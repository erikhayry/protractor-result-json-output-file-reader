var fs = require('fs');
var chalk = require('chalk');
var _ = require('lodash-node');
var Q = require('q');

function ResultJsonOutputFileReader() {

    function _readFile(fileName) {
        var deferred = Q.defer();

        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(JSON.parse(data));
            }
        });

        return deferred.promise;
    }

    function _getTestBody(test) {
        return (test.passed) ? '  ' + chalk.green('ok') : '  ' + chalk.red(test.errorMsg) + '\n  ' + chalk.gray(test.stackTrace);
    }

    function _getTests(title, tests) {
        return tests.reduce(function(output, test) {
            return output + _getTestBody(test);
        }, title + '\n');

    }

    function _getScenarioTitle(scenario) {
        return chalk.bold(scenario.description) + chalk.gray(' (' + scenario.duration + 'ms)');
    }

    function _getScenarios(scenarios) {
        return scenarios.reduce(function(output, scenario) {
            return output + _getTests(_getScenarioTitle(scenario), scenario.assertions) + '\n\n';
        }, '\n')
    }

    function _getLog(filePath) {
        var deferred = Q.defer();

        _readFile(filePath)
            .then(function(scenarios) {
                deferred.resolve(_getScenarios(scenarios));
            });

        return deferred.promise;
    }

    return {

        getLog: _getLog,

        getLogFromJSON: function(json) {
            return _getScenarios(json);
        },

        printLog: function(filePath) {
            _getLog(filePath).then(function(data) {
                console.log(data);
            })
        },

        printFromJson: function(json) {
            console.log(_getScenarios(json));
        }
    }
}

module.exports = new ResultJsonOutputFileReader();