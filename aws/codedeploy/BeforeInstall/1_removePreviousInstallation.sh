#!/bin/sh

deployment_dir=/opt/microservices-in-person/
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
  cd /opt/microservices-in-person/api-gateway

  rm -rf $deployment_dir
fi