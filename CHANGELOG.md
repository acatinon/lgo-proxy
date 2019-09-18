# Changelog

## 1.3.0 (2019-09-19)

### Added

- New http live endpoints

### Changed

- Order placement or cancellation now return order id
- Deprecate some endpoints to reflect new /v1/history urls

## 1.2.0 (2019-08-06)

### Changed

- Environments are simplified to `production` and `sandbox`
- `markets-production` and `exchange-production` are merged to single `production` environment
- `markets-sandbox` and `exchange-sandbox` are merged to single `sandbox` environment

## 1.1.5 (2019-07-16)

### Changed

- Add candles endpoint, thanks to @acatinon.

## 1.1.4 (2019-07-10)

### Changed

- Add exchange-sandbox and exchange-production environments options, thanks to @acatinon.

## 1.1.3 (2019-06-11)

### Changed

- Using standard setTimeout instead of cron dependency to retrieve keys

## 1.1.1 (2019-05-14)

### Changed

- Proxy can now target LGO Exchange environment

### Fixed

- SoftHSM LGO slot detection is more reliable

## 1.1.0 (2019-05-07)

### Changed

- LGO backend urls can be overriden via env vars
- Accounting operations endpoint

## 1.0.8 (2019-04-24)

### Changed

- The proxy can now be started to target sandbox or production environment

## 1.0.4 (2019-03-29)

### Changed

- Node 8 -> Node 10

### Fixed

- Request timeout added in http service to avoid infinite wait on keys download

## 1.0.3 (2019-03-20)

### Fixed

- Order placement or cancellation via ws or http allows client to provide a reference

## 1.0.2 (2019-03-19)

### Added

- We check proxy is correctly initialized at startup to fail fast
