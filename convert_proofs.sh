#!/bin/bash

build_contracts() {
  if [ ! -d "./o1js-blobstream/contracts/build" ]; then
    cd ./o1js-blobstream/contracts || exit 1
    npm install
    npm run build
    cd - || exit 1
  fi
}

setup_env() {
  cd ./o1js-blobstream/scripts || exit 1

  export WORK_DIR=conversion
  export RUN_DIR=$(pwd)/$WORK_DIR
  export PROOF_DIR=../../sp1-helios-proofs

  mkdir -p "$RUN_DIR"
}

process_proof_files() {
  for proof_file in "$PROOF_DIR"/*.json; do
    if [[ -f "$proof_file" ]]; then
      filename=$(basename "$proof_file" .json)

      if node ../contracts/build/src/blobstream/sp1_to_env.js \
          "$proof_file" \
          "$RUN_DIR" \
          "$WORK_DIR" \
          "$filename"; then
        ./e2e_plonk.sh "$RUN_DIR/env.$filename"
        echo "Processed $filename successfully."
      else
        echo "Error executing sp1_to_env.js for $proof_file."
      fi
    else
      echo "No JSON files found in $PROOF_DIR."
    fi
  done
}

build_contracts
setup_env
process_proof_files
