.PHONY: build

# Build an image for a given service s=[service]
build:
	@$(MAKE) _build service=$(call get_service) tag=$(call get_tag) type=$(call get_type) ha_proxy_file=haproxy_prod.cfg

dbuild:
	@$(MAKE) _build service=$(call get_service) tag=$(call get_tag) type=$(call get_type) ha_proxy_file=haproxy_dev.cfg

# Build an image for a given service service=[service]
_build:
	echo "Building image for $(service) with tag $(tag) and type $(type) and ha_proxy_file $(ha_proxy_file)"
	@./scripts/build.sh $(service) $(tag) $(type) $(ha_proxy_file)
