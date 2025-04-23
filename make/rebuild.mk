.PHONY: rebuild _rebuild

# Rebuild main app image based off the latest app image. This is useful when you just need to copy over the latest files without a full rebuild. (make rebuild s=connect)
rebuild:
	@$(MAKE) _rebuild service=$(call get_service) tag=$(call get_tag) ha_proxy_file=$(call get_ha_proxy_file)

# Rebuild main app image based off the latest app image
_rebuild:
	@./scripts/build.sh $(service) $(tag) rebuild $(ha_proxy_file)