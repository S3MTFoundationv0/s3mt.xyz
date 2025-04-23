ARG BASE_IMAGE=ghcr.io/s3mtfoundation/s3mt.xyz:latest

FROM $BASE_IMAGE

ARG IMAGE_TAG
ARG IMAGE_VERSION
ARG NODE_ENV
ARG S3MT_VERSION
ARG HA_PROXY_FILE=haproxy_prod.cfg

COPY ./docker/system/s3mt.xyz /
COPY ./docker/system/s3mt.xyz/opt/haproxy/${HA_PROXY_FILE} /etc/haproxy/cfg/haproxy_1.cfg

RUN mkdir -p /.yarn
RUN chown -R nobody:nobody /.yarn

RUN mkdir -p /.cache
RUN chown -R nobody:nobody /.cache

RUN install-os-deps

RUN chown -R nobody:nobody $APP_ROOT

RUN yarn-install -b

RUN chown -R nobody:nobody $APP_ROOT/.nuxt