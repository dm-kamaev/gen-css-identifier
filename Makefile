.PHONY: test

test:
	npx jest --coverage

create_badges:
	npx coverage-badges

publish:
	npm publish --access public