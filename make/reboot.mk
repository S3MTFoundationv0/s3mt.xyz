.PHONY: reboot _reboot

# Reboot a specific service using (s=[service]) or all services. (ex. make reboot s=s3mt.xyz)
reboot:
	@$(MAKE) _reboot service=$(call get_service)

# Reboot a specific service using (s=[service]) or all services. (ex. make reboot s=s3mt.xyz)
_reboot:
	@./scripts/reboot.sh $(service)