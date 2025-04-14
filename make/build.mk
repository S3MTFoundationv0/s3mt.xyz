.PHONY: build

# Build an image for a given service s=[service]
build:
	@$(MAKE) _build service=$(call get_service) tag=$(call get_tag) type=$(call get_type)

# Build an image for a given service service=[service]
_build:
	@./scripts/build.sh $(service) $(tag) $(type)
