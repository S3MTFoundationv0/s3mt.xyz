.PHONY: recopy _recopy

# Rebuild main app image based off the latest app image. This is useful when you just need to copy over the latest files without a full rebuild. (make rebuild s=connect)
recopy:
	@$(MAKE) _recopy service=$(call get_service) tag=$(call get_tag) ha_proxy_file=$(call get_ha_proxy_file)

# Rebuild main app image based off the latest app image
_recopy:
	@./scripts/build.sh $(service) $(tag) recopy $(ha_proxy_file)