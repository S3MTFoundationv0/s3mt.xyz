FROM ghcr.io/s3mtfoundation/validator:${VALIDATOR_IMAGE_TAG:-latest}

COPY docker/system/validator /

# Default to running the validator