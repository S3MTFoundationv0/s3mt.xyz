#!/bin/bash

set -e

source scripts/common.sh

SERVICE=$(echo $1 | tr '[:upper:]' '[:lower:]')

TAG=${2:-latest}

BASE_TAG=ghcr.io/s3mtfoundation/$SERVICE:$TAG

ENV_VAR=$(convert_service_to_env_var "$SERVICE")

CURRENT_DIR=$(pwd)

IMAGE_VERSION=$(get_image_version)

BASE_FILE=docker/dockerfiles/$SERVICE/base.dockerfile

cd $CURRENT_DIR

if [ -f scripts/prebuild/${service}.sh ]; then
    echo "Running prebuild script for $service"
    scripts/prebuild/${service}.sh
fi

echo "Building image locally...."
echo "Base Tag: $BASE_TAG"
echo "Image Version: $IMAGE_VERSION"
echo "Dockerfile: $BASE_FILE"
echo
echo

BUILDKIT_PROGRESS=plain docker build \
    -t $BASE_TAG \
    --build-arg "IMAGE_VERSION=$IMAGE_VERSION" \
    --build-arg "IMAGE_TAG=$BASE_TAG" \
    --no-cache \
    --file=$BASE_FILE \
    .

setenv "$ENV_VAR" "$TAG"
