#!/bin/bash


docker run -d --rm --name s3mt-presale-standalone\
    -p 80:80\
    -p 443:443\
    --env-file docker/.config/.env.shared\
	--env-file docker/.config/.env.s3mt.xyz-prod\
	ghcr.io/s3mtfoundation/s3mt.xyz:latest