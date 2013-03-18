optimize:
	./node_modules/.bin/r.js -o mainConfigFile=static/js/require-config.js \
	baseUrl=static/js name=main out=static/js/main-built.js

clean:
	rm -f static/js/main-built.js
