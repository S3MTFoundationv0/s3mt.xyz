#!/bin/bash

set -e

source docker/compose/.env

source scripts/common.sh

SERVICE=$(echo $1 | tr '[:upper:]' '[:lower:]')

TAG=${2:-latest}

BUILD_TYPE=${3:-base}

BASE_TAG=$CONTAINER_REGISTRY/$ORGANIZATION/$SERVICE:$TAG

ENV_VAR=$(convert_service_to_env_var "$SERVICE")

IMAGE_VERSION=$(get_image_version)

BASE_FILE=docker/dockerfiles/$SERVICE/$BUILD_TYPE.dockerfile

if [ ! -f $BASE_FILE ]; then
    echo "Dockerfile not found: $BASE_FILE"
    exit 1
fi

if [ -f scripts/prebuild/${SERVICE}.sh ]; then
    echo "Running prebuild script for $SERVICE"
    scripts/prebuild/${service}.sh
fi

HA_PROXY_FILE=${4:-haproxy_prod.cfg}

echo "Building image locally...."
echo "Service: $SERVICE"
echo "Base Tag: $BASE_TAG"
echo "Image Version: $IMAGE_VERSION"
echo "Dockerfile: $BASE_FILE"
echo "HA Proxy File: $HA_PROXY_FILE"
echo
echo

BUILDKIT_PROGRESS=plain docker build \
    -t $BASE_TAG \
    --build-arg "IMAGE_VERSION=$IMAGE_VERSION" \
    --build-arg "IMAGE_TAG=$BASE_TAG" \
    --build-arg "HA_PROXY_FILE=$HA_PROXY_FILE" \
    --no-cache \
    --file=$BASE_FILE \
    .

setenv "$ENV_VAR" "$TAG"
