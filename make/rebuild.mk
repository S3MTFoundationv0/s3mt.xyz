.PHONY: rebuild _rebuild

# Rebuild main app image based off the latest app image. This is useful when you just need to copy over the latest files without a full rebuild. (make rebuild s=connect)
rebuild:
	@$(MAKE) _rebuild service=$(call get_service) tag=$(call get_tag)

# Rebuild main app image based off the latest app image
_rebuild:
	@./scripts/build.sh $(service) $(tag) rebuild