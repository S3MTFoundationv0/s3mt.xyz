#!/bin/bash

if [ -z "$FULLCHAIN_TLS" ]; then
    echo "FULLCHAIN is not set. Skipping SSL certificate setup."
    exit 0
fi

mkdir -p docker/system/s3mt.xyz/etc/ssl/

echo $FULLCHAIN_TLS > docker/system/s3mt.xyz/etc/ssl/s3mt.xyz.fullchain.pem

