#!/bin/sh

deployment_dir=/opt/microservices-inperson/api-gateway
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
  cd /opt/microservices-inperson/api-gateway

  /usr/bin/pm2 stop api-gateway || true
fi