#!/bin/bash

cd sp1-helios || { echo "sp1-helios folder not found"; exit 1; }

if [ ! -f .env ]; then
  echo ".env file not found in sp1-helios folder"
  exit 1
fi

required_vars=(
  "SOURCE_CHAIN_ID"
  "SOURCE_CONSENSUS_RPC_URL"
  "DEST_RPC_URL"
  "DEST_CHAIN_ID"
  "PRIVATE_KEY"
  "SP1_PROVER"
  "CONTRACT_ADDRESS"
)

check_env_vars() {
  for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
      echo "Environment variable $var is missing or empty in .env"
      exit 1
    fi
  done
}

check_env_vars

echo "All required environment variables are present in .env"

export RUST_LOG=info
cargo run --release --bin operator
