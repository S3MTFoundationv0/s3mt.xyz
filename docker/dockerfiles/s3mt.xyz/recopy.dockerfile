FROM ghcr.io/s3mtfoundation/s3mt.xyz:latest

COPY ./docker/system/s3mt.xyz /

RUN chown -R nobody:nobody /app