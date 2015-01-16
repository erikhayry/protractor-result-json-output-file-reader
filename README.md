# protractor-result-json-output-file-reader

## To print out the output:

in protractor config file
<pre>
...
    resultJsonOutputFile: '.e2e-output.json',
    afterLaunch: function() {
        var fs = require('fs'),
            log = fs.readFileSync('.e2e-output.json', 'utf8'),
            prjofr = require('protractor-result-json-output-file-reader');
        prjofr.printFromJson(JSON.parse(log));
    },
...
</pre>