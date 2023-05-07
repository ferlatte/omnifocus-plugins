SHELL = /bin/bash
PRE-COMMIT := $(shell which pre-commit)

# Shortcut to run pre-commit hooks over the entire repo.
pre-commit: .git/hooks/pre-commit
	pre-commit run --all-files

# Update the pre-commit hooks if the pre-commit binary is updated.
.git/hooks/pre-commit: $(PRE-COMMIT)
	pre-commit install

release:
	zip -r FerlatteTools.omnifocusjs.zip FerlatteTools.omnifocusjs

.PHONY: release
