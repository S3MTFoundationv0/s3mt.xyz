.PHONY: programs _programs
# Show installed programs on local validator
programs:
	@$(MAKE) _programs

_programs:
	@bash ./scripts/programs.sh