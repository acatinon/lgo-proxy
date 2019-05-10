# Run proxy with Docker

## Use the available docker image

Docker image is available on official registry: https://hub.docker.com/r/lgopublic/lgo-proxy

We encourage you to use a specific tag instead of `latest` one.

For examples below we will use `v1.1.0` as tag.

```
docker pull lgopublic/lgo-proxy:v1.1.0
```

## Build the image

You can alternatively build the image yourself.

```
docker build . -t lgo-proxy
```

## Initialize the proxy

You can skip this step if you already have a token on the host.

Note the pin, you will reuse it to start the server in the next step.

Adapt the env variables below and run:

```
docker run \
  --rm \
  -v <your_tokens_location>:/var/lib/softhsm/tokens \
  -e LGO_SIGNER_PIN=<your_pin> \
  lgopublic/lgo-proxy:v1.1.0 \
  init
```

Replace `<your_tokens_location>` with a host directory.
The token used by the proxy will be stored in that location.
It may be useful to backup those data if you want to keep the same access key and public key.

## Start the proxy server

Adapt the env variables below and run:

```
docker run \
  -d \
  -v <your_tokens_location>:/var/lib/softhsm/tokens \
  -e LGO_SIGNER_PIN=<your_pin> \
  -e LGO_ACCESS_KEY=<your_access_token> \
  --restart=on-failure \
  --name lgo-proxy \
  -p 3002:3002 \
  lgopublic/lgo-proxy:v1.1.0
```

Replace `<your_tokens_location>` with the tokens location on your host.

You can target another environment with another variable: `-e LGO_ENV=markets-sandbox`.

You may use or not the provided restart policy in example.
See [docker documentation](https://docs.docker.com/engine/reference/run/#restart-policies---restart) for more details.
