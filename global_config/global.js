var config = {};

config.redis = {
	host : process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1",
	port : process.env.REDIS_PORT_6379_TCP_PORT || 6379
};

config.serverUrl = 'http://localhost';

config.integration = [
/*
 * { installUrl:
 * 'http://keeleliin.keeleressursid.ee:3000/api/v1/service/install', apiKey:
 * 'server-wrapper-api-key' }
 */
];

config.fs = {
	storagePath : "/wrapper/files",
	tmpPath : "/wrapper/tmp"
};

config.paramTypes = {
	TEXT : 'text',
	SELECT : 'select'
};

config.log4js = {
	appenders : [ {
		"type" : "logLevelFilter",
		"level" : "DEBUG",
		"appender" : {
			type : 'console',
			layout : {
				type : 'pattern',
				pattern : "[%d] %[[%x{port}-%x{pid}][%5.5p]%] %c - %m",
				tokens : {
					pid : process.pid,
					port : function() {
						return config.wrapper.port;
					}
				}
			}
		}
	}, {
		"type" : "logLevelFilter",
		"level" : "DEBUG",
		"appender" : {
			type : 'file',
			filename : __dirname + '/../wrapper.log',
			layout : {
				type : 'pattern',
				pattern : "[%d] %[[%x{port}-%x{pid}][%5.5p]%] %c - %m",
				tokens : {
					pid : process.pid,
					port : function() {
						return config.wrapper.port;
					}
				}
			}
		}
	} ]
};

config.isAsyncParamDescription = {
	type : config.paramTypes.SELECT,
	options : [ '0', '1' ],
	value : '1',
	filter : function(value) {
		return value == 1;
	},
	required : true,
	allowEmpty : false,
	validator : function(value, request) {
		return true;
	}
};

config.stringKeyDescription = {
	type : config.paramTypes.TEXT,
	value : undefined,
	filter : null,
	required : false,
	allowEmpty : true,
	validator : function(value, request) {
		return true;
	}
};

config.fileKeyDescription = {
	type : config.paramTypes.TEXT,
	value : undefined,
	filter : null,
	required : false,
	allowEmpty : true,
	validator : function(value, request) {
		return true;
	}
};

config.wrapper = {
	id : null, // unikaalne lühinimi
	title : null, // Avalik nimi
	description : '', // Kirjeldus
	port : null, // port
	class : null, // wrapperi failinimi wrapper kaustast, mida utiliidi
					// käivitamiseks kasutatakse
	command : null, // utiliidi käsurea käsk
	requestConf : null, // Päringu seadistus
	outputTypes : null, // teenuse väljundressursside kirjeldus
	sessionMaxLifetime : 600
// sessiooni maksimaalne kestvus
};

config.availableCommands = {
	TOKENIZER : {
		commandTemplate : 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/tokenizer.py -i [data] -o [output]'
	},
	MORFANALYSAATOR : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfanalyzer.sh [data]'
	},
	LAUSESTAJA : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./lausestaja.sh [data]'
	},
	OSALAUSESTAJA : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./osalausestaja.sh [data]'
	},
	MORFYHESTAJA : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfyhestaja.sh [data]'
	},
	PIND_SYN : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./pindsyn.sh [data]'
	},
	S6LT_SYN : {
		commandTemplate : '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./s6ltsyn.sh [data]'
	},
	CONCAT : {
		commandTemplate : 'cat [data]'
	},
	MORPH_TAGGER : {
		commandTemplate : 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/morph_tagger.py -i [data] -o [output]'
	}
};

config.availableWrappers = {

	LAUSESTAJA : {
		title : 'Lausestaja',
		description : '',
		id : 'lau',
		port : 3001,
		class : 'simpleLocalCommand',
		command : config.availableCommands.LAUSESTAJA,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'text',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'lau_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	MORFANALYSAATOR : {
		title : 'Morfoloogiline analüüs',
		description : '',
		id : 'moa',
		port : 3002,
		class : 'simpleLocalCommand',
		command : config.availableCommands.MORFANALYSAATOR,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'lau_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'moa_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	OSALAUSESTAJA : {
		title : 'Osalausestaja',
		description : '',
		id : 'osl',
		port : 3011,
		class : 'simpleLocalCommand',
		command : config.availableCommands.OSALAUSESTAJA,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'moa_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'osl_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	MORFYHESTAJA : {
		title : 'Morfoloogiline ühestamine (kitsenduste grammatika)',
		description : '',
		id : 'moy',
		port : 3004,
		class : 'simpleLocalCommand',
		command : config.availableCommands.MORFYHESTAJA,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'osl_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'moy_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	PIND_SYN : {
		title : 'Pindsüntaktiline analüüs',
		description : '',
		id : 'pia',
		port : 3005,
		class : 'simpleLocalCommand',
		command : config.availableCommands.PIND_SYN,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'moy_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'pia_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	S6LT_SYN : {
		title : 'Sõltuvussüntaktiline analüüs (ja järeltöötlus)',
		description : '',
		id : 's6a',
		port : 3006,
		class : 'simpleLocalCommand',
		command : config.availableCommands.S6LT_SYN,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'pia_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 's6a_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},

	ARCHIVE_EXTRACTOR : {
		title : 'Arhiivi lahtipakkija',
		description : '',
		id : 'uzip',
		port : 3007,
		class : 'archiveExtractor',
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'zip',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'text',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	TOKENIZER : {
		title : 'Sõnestaja (pipe)',
		description : '',
		id : 'tok',
		port : 3008,
		class : 'inputOutputLocalCommand',
		command : config.availableCommands.TOKENIZER,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'text',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'tok_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	CONCAT : {
		title : 'Lihtne konkateneerija',
		id : 'concat',
		port : 3009,
		class : 'simpleLocalCommand',
		command : config.availableCommands.CONCAT,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'text',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : true
				}
			}
		},
		outputTypes : [ {
			type : 'text',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	},
	MORPH_TAGGER : {
		title : 'Morfoloogiline analüsaator (pipe)',
		id : 'tag',
		port : 3010,
		class : 'inputOutputLocalCommand',
		command : config.availableCommands.MORPH_TAGGER,
		requestConf : {
			requestBodyParamsMappings : {
				isAsync : config.isAsyncParamDescription
			},
			requestFiles : {
				content : {
					type : 'tok_a',
					sizeLimit : 0,
					sizeUnit : 'byte',
					isList : false
				}
			}
		},
		outputTypes : [ {
			type : 'tag_a',
			key : 'output'
		} ],
		sessionMaxLifetime : 600
	}
};

module.exports = config;