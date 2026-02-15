# Rentinel Sui Contract

On-chain rental application fairness lifecycle: Apply → Accept/Reject → Ghost after 48h.

## Modules

### `rentinel_contract::rentinel_contract`
- `submit_application(listing, message_hash)` — Event-based timestamp (legacy)

### `rentinel_contract::application`
- `apply(clock, tenant, landlord, listing)` — Creates shared Application object
- `accept(app, ctx)` — Landlord accepts (must be landlord)
- `reject(app, ctx)` — Landlord rejects (must be landlord)
- `mark_ghosted(clock, app)` — Anyone can call after 48h → proves silence on-chain

## Build

```bash
sui move build -p rentinel_contract
```

## Publish to Testnet

**You need testnet SUI for gas.** Get tokens: https://faucet.sui.io/

```bash
sui client publish rentinel_contract --gas-budget 100000000
```

**Save the PackageID** and add to `frontend/.env`:
```
VITE_RENTINEL_PACKAGE_ID=0x...
VITE_DEMO_LANDLORD=0x...  # Your second wallet for accept/reject demo
```
