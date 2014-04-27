var express    = require('express'),
    partials   = require('express-partials'),
    browserify = require('connect-browserify'),
    geoip      = require('express-cf-geoip'),
    http       = require('http'),
    path       = require('path'),
    fs         = require('fs'),
    options    = require('./options'),
    app        = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(options.cookieSecret));
app.use(express.session({ secret: options.sessionSecret }));
app.use(function(req, res, next) { req.realip = req.header('cf-connecting-ip') || req.ip; next(); });
app.use(geoip.middleware('us'));
app.use(partials());
app.use(app.router);
app.use('/game.js', browserify(__dirname + '/scripts/index.js'));
app.use(require('stylus').middleware({ src: __dirname + '/styles', dest: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

fs.readdirSync(__dirname + '/routes').forEach(function(file) {
	var routes = require(__dirname + '/routes/' + file);

	Object.keys(routes).forEach(function(route) {
		if (typeof routes[route] == 'function')
			app.get(route, routes[route]);

		if (routes.hasOwnProperty(route)) {
			Object.keys(routes[route]).forEach(function(method) {
				if (routes[route].hasOwnProperty(method))
					app[method](route, routes[route][method]);
			});
		}
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

function geoip(cc) {
	cc=cc||'us';var c=':af ao bfijw cdfgimv djz eghrt gahmnqw kem lrsy maglruwz naeg rew scdhlnostz tdgnz ug yt zamw:an aq bv gs hm tf:as aefmz bdhnt ccnxy ge hk idlnoqr jop kghprwz labk mmnovy np om phks qa ru sagy thjlmrw uz vn xdes ye:eu adlmtxz baegy chyz dek ees fior gbegir hru iemst je kz lituv mcdekt nlo plt rosu seijkm tr ua va:na aginw bblmqsz caruw dmo gdlpt hnt jm kny lc mfqsx ni pamr svx tct ums vcgi:oc asu ck fjm gu ki mhp ncfruz pfgnw sb tkov um vu wfs xx:sa ar bor clo ec fk gfy pey sr uy ve:'.match(new RegExp(':(..)[^:]* (' + cc[0] + ')[^ ]*(' + cc[1] + ')', 'i'));
	return { country: c[1], continent: c[2] + c[3] };
}
