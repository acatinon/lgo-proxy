# Run proxy with Docker Swarm

Running in swarm mode allow you to use built-in secrets instead of plain environment variables.

You need a proxy package to run it with Docker in swarm mode.

## Build the image

```
docker build . -t lgo-proxy
```

## Initialize Swarm

Skip this part if you already have a swarm cluster.

```
docker swarm init
```

## Create a secret for the pin

Skip this part if you already have a swarm secret for the pin.

```
printf "<your_pin>" | docker secret create lgo_signer_pin -
```

Replace `<your_pin>` with the pin you want to use or the one you already have.

## Initialize the proxy

You can skip this step if you already have a token on the host.

```
docker service create \
  --restart-condition=none \
  --mount type=bind,source=<your_tokens_location>,destination=/var/lib/softhsm/tokens \
  --secret lgo_signer_pin \
  --name lgo-proxy-init \
  -e LGO_SIGNER_PIN_FILE="/run/secrets/lgo_signer_pin" \
  -d \
  lgo-proxy \
  init
```

Replace `<your_tokens_location>` with a host directory.
The token used by the proxy will be stored in that location.
It may be useful to backup those data if you want to keep the same access key and public key.

## Retrieve your public key

Just access to the previous service logs:

```
docker service logs --follow --raw lgo-proxy-init
```

Just wait a short time to see your public key and its fingerprint.

The initialization is done, you should remove this ephemeral service:

```
docker service rm lgo-proxy-init
```

## Create a secret for the access key

Skip this part if you already have a swarm secret for the access key.

```
printf "<your_access_key>" | docker secret create lgo_access_key -
```

Replace `<your_access_key>` with the one you have been provided.

## Start the proxy server

```
docker service create \
  --restart-condition=on-failure \
  --mount type=bind,source=<your_tokens_location>,destination=/var/lib/softhsm/tokens \
  --secret lgo_signer_pin \
  --secret lgo_access_key \
  --name lgo-proxy \
  -e LGO_SIGNER_PIN_FILE="/run/secrets/lgo_signer_pin" \
  -e LGO_ACCESS_KEY_FILE="/run/secrets/lgo_access_key" \
  -p 3002:3002 \
  -d \
  lgo-proxy
```

Replace `<your_tokens_location>` with the tokens location on your host.

You may use or not the provided restart condition in example.
See [docker documentation](https://docs.docker.com/engine/reference/commandline/service_create) for more details.

To display logs, just run:

```
docker service logs --follow --raw lgo-proxy
```

## Remove the service when not needed anymore

```
docker service rm lgo-proxy
```
