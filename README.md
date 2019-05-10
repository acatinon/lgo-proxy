# LGO Proxy

[![build status](https://gitlab.com/lgo_public/lgo-proxy/badges/master/build.svg)](https://gitlab.com/lgo_public/lgo-proxy/commits/master)

LGO proxy is an HTTP and WebSocket server which encapsulate encryptions keys and request signature to target LGO API.

## Environments

LGO proxy can be configured to target LGO Markets or LGO Exchange with their own production or sandbox environments.

See [Run server](#run-server) to learn how to target an environment.

Available environments:

| Name                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| markets-production  | LGO Markets production environment. Default environment.         |
| markets-sandbox     | LGO Markets sandbox environment to test api without real money.  |
| exchange-production | LGO Exchange production environment.                             |
| exchange-sandbox    | LGO Exchange sandbox environment to test api without real money. |

## Documentation

| Distributor  | Url                              |
| ------------ | -------------------------------- |
| LGO Markets  | https://doc.exchange.lgo.markets |
| LGO Exchange | https://doc.trading.lgo.exchange |

## Run with docker

The simplest way to run LGO proxy is to use docker.

See [docs/docker.md](docs/docker.md) or [docs/swarm.md](docs/swarm.md).

## Requirements

If you choose to use LGO proxy without docker some tools must be installed on your machine.

### Linux

Examples are based on Ubuntu.

Install:

- wget
- build-essential (or enough tooling to compile)
- [nvm](https://github.com/creationix/nvm)
- libssl-dev (OpenSSL headers, you can also use Botan's one)

Install SoftHSM:

(The example below uses SoftHSM 2.5.0.)

```
wget https://dist.opendnssec.org/source/softhsm-2.5.0.tar.gz
tar -xzf softhsm-2.5.0.tar.gz
cd softhsm-2.5.0
./configure --disable-gost
make
sudo make install
```

Configuration locations are:

- configuration: `/usr/local/lib/softhsm/softhsm2.conf`
- tokens: `/var/lib/softhsm/tokens`

### macOS

Install:

- [brew](https://brew.sh)
- [nvm](https://github.com/creationix/nvm)

Install SoftHSM:

```
brew install softhsm
```

Configuration locations are:

- configuration: `/usr/local/etc/softhsm/softhsm2.conf`
- tokens: `/usr/local/var/lib/softhsm/tokens`

## Installation

Install project dependencies:

```
nvm install
npm install --production
```

## Initialize

```
node ./lib/main init \
  --signer-library-path <softhsm_library_path> \
  --signer-pin <your_pin>
```

## Run server

```
node ./lib/main start \
  --signer-library-path <softhsm_library_path> \
  --signer-pin <your_pin> \
  --access-key <your_access_key>
```

Examples of signer library paths based on OS:

| OS    | Path                                                       |
| ----- | ---------------------------------------------------------- |
| Linux | /usr/local/lib/softhsm/libsofthsm2.so                      |
| macOS | /usr/local/Cellar/softhsm/2.5.0/lib/softhsm/libsofthsm2.so |

You can target another environment with an option: `--env markets-sandbox`.

## License

[MIT](LICENSE)
