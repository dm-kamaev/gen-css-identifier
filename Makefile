.PHONY: test

test:
	npx jest --coverage

publish:
	npm publish --access public