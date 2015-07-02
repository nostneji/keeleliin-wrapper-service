var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var localExecutor = require('./../src/service/executor/localExecutor');
var Session = require('../src/model/session');
var SessionService = require('./../src/service/sessionService');

var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');



function ContentTokenizer(){

    var self = this;

    this.process = function ( session, callback) {
        var contentFile = session.requestFiles.content;
        var sourceText = fs.readFileSync(contentFile).toString(); //todo: peaks olema async

        self.getCommandModel(session, function (err, model) {
            logger.debug('getCommandModel callback');
            if(err) return callback(err);

            localExecutor.execute( model, function ( err, response ) {
                if(err) return callback(err);

                logger.debug('Väline programm on lõpetanud');

                fs.readFile(model.outputPaths.outputPath1, function (err, output) {
                    if(err) return callback(err);

                    var wrapperOutput = output.toString();
                    var outputStrings = wrapperOutput.split("\n");
                    var tokens = [];

                    var globalStart = 0;

                    for(i in outputStrings){
                        var string = outputStrings[i];

                        var start = sourceText.indexOf(string);
                        var stringStart = globalStart + start;
                        var stringLength = string.length;

                        sourceText = sourceText.slice(start + stringLength); //eemaldan lähteteksti alguse, et korduvad sõnad ei jääks sama asukohaga

                        globalStart = stringStart + stringLength;

                        var token = {
                            idx: i,
                            location: [stringStart, globalStart ]
                        };
                        tokens.push(token);
                    }

                    session.message = Session.messages.OK;

                    var mapping = JSON.stringify(tokens);
                    logger.debug('Failide mappimine on lõpetatud');
                    SessionService.storeToFile(session.id, mapping, function (error, mappingPath) {
                        session.addOutputFile('output', model.outputPaths.outputPath1);
                        session.addOutputFile('mapping', mappingPath);
                        return callback( error, session );
                    });

                });

            });

        });
    };

    this.getCommandModel = function (session, callback) {
        var model = new CommandModel();
        model.serviceProperties.commandTemplate = config.availableWappers.CONTENT_TOKENIZER.commandTemplate;
        model.init( session );
        model.setTextValue('data', session.requestFiles.content);
        model.addOutputPath('outputPath1');
        model.render(function (err) {
            logger.debug('Render callback');
            callback(err, model);
        });
    }
}

module.exports = ContentTokenizer;