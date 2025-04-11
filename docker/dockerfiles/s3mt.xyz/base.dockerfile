ARG BASE_IMAGE=node:20-alpine

FROM $BASE_IMAGE

ARG IMAGE_TAG
ARG IMAGE_VERSION
ARG NODE_ENV
ARG S3MT_VERSION

ENV APP_ROOT=/app
ENV HOST=0.0.0.0
ENV IMAGE_VERSION=${IMAGE_VERSION}
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=${NODE_ENV:-production}
ENV COMMIT_SHA_FRONT=${COMMIT_SHA_FRONT:-${IMAGE_VERSION}}

LABEL image.name="s3mt.xyz"
LABEL image.version="$IMAGE_VERSION"
LABEL image.tag="$IMAGE_TAG"

WORKDIR $APP_ROOT
EXPOSE 80
ENTRYPOINT [ "/entrypoint" ]

RUN apk add --no-cache jq haproxy sudo supervisor yarn git make gcc g++ linux-headers eudev-dev

RUN mkdir -p /var/log/supervisor

RUN yarn global add merge-packages tsx --prefix /usr/local

COPY ./docker/system/s3mt.xyz /
RUN chown -R nobody:nobody $APP_ROOT

RUN yarn-install -b

RUN chown -R nobody:nobody $APP_ROOT/.nuxt