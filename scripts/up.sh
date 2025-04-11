#!/bin/bash

source ./scripts/common.sh

files=$(compose_context_files "${1:-base}" "false")

run_service_in_context "$files" "$1"
