ARG BASE_IMAGE=ghcr.io/s3mtfoundation/s3mt.xyz:latest

FROM $BASE_IMAGE

ARG IMAGE_TAG
ARG IMAGE_VERSION
ARG NODE_ENV
ARG S3MT_VERSION

COPY ./docker/system/s3mt.xyz /

RUN install-os-deps

RUN chown -R nobody:nobody $APP_ROOT

RUN yarn-install -b

RUN chown -R nobody:nobody $APP_ROOT/.nuxt