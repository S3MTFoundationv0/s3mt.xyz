#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <service>"
    exit 1
fi

source ./scripts/common.sh

files=$(compose_context_files "$1" "true")

run_service_in_context "$files" "$1"
