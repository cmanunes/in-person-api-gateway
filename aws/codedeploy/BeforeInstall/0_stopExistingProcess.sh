#!/bin/sh

deployment_dir=/opt/microservices-in-person/api-gateway
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
  cd /opt/microservices-in-person/api-gateway

  /usr/bin/pm2 stop api-gateway || true
fi