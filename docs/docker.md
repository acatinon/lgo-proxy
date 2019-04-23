# Run proxy with Docker

## Build the image

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
  lgo-proxy \
  init
```

```
docker run \
  --rm \
  -v <your_tokens_location>:/var/lib/softhsm/tokens \
  -e LGO_SIGNER_PIN=<your_pin> \
  lgo-proxy \
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
  lgo-proxy
```

Replace `<your_tokens_location>` with the tokens location on your host.

You may use or not the provided restart policy in example.
See [docker documentation](https://docs.docker.com/engine/reference/run/#restart-policies---restart) for more details.
