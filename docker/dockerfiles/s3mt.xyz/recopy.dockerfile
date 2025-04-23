FROM ghcr.io/s3mtfoundation/s3mt.xyz:latest

ARG HA_PROXY_FILE=haproxy_prod.cfg

COPY ./docker/system/s3mt.xyz /
COPY ./docker/system/s3mt.xyz/opt/haproxy/${HA_PROXY_FILE} /etc/haproxy/cfg/haproxy_1.cfg
RUN chown -R nobody:nobody /app