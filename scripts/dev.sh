#!/bin/bash

source ./scripts/common.sh

./scripts/down.sh

files=$(compose_context_files "${1:-traefik}" "true")

run_service_in_context "$files" "$1"
