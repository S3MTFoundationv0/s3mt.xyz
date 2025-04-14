#!/bin/bash

DOCKERD_ROOTLESS_ROOTLESSKIT_NET=slirp4netns /home/mrprice/bin/dockerd-rootless.sh

docker run -d --name s3mt-presale-standalone -p 80:80 -p 443:443 -v $(pwd)/data/acme.json:/acme.json -v $(pwd)/data/s3mt.xyz:/app/dist --env-file $(pwd)/.config/.env.shared --env-file docker/.config/.env.s3mt.xyz-prod s3mtfoundation/s3mt.xyz:latest


