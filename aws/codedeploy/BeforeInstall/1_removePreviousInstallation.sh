#!/bin/sh

deployment_dir=/opt/microservices-inperson/
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
  cd /opt/microservices-inperson/api-gateway

  rm -rf $deployment_dir
fi