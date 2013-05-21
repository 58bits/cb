REPORTER = list

test:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--growl \
		--ui bdd
 
test-w:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--growl \
		--ui tdd \
		--watch
 
.PHONY: test test-w