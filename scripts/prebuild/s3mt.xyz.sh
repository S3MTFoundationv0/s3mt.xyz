#!/bin/bash

if [ -n "$FULLCHAIN_TLS" ]; then
    echo "FULLCHAIN is set. Setting up SSL certificate."
    mkdir -p docker/system/s3mt.xyz/etc/ssl/
    echo "$FULLCHAIN_TLS" | base64 --decode > docker/system/s3mt.xyz/etc/ssl/beta.s3mt.xyz.fullchain.pem
fi



if [ -n "$FULLCHAIN_TLS_PROD" ]; then
    echo "FULLCHAIN_PROD is set. Setting up SSL certificate."
    mkdir -p docker/system/s3mt.xyz/etc/ssl/
    echo "$FULLCHAIN_TLS_PROD" | base64 --decode > docker/system/s3mt.xyz/etc/ssl/s3mt.xyz.fullchain.pem
fi


