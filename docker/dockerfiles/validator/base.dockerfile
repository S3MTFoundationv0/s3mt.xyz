FROM solanalabs/solana:v1.18.26

COPY docker/system/validator /

WORKDIR /solana

# Default to running the validator
ENTRYPOINT ["/usr/local/bin/start-validator.sh"] 