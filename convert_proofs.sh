#!/bin/bash

cd ~/Documents/all/dev/sp1-helios-o1js/o1js-blobstream/scripts || exit

export WORK_DIR=run-e2e-sp1helios
export RUN_DIR=$(pwd)/$WORK_DIR
export PROOF_DIR=../../sp1-helios/data/proofs

mkdir -p "$RUN_DIR"

for proof_file in $PROOF_DIR/*.json; do
    if [[ -f "$proof_file" ]]; then
        filename=$(basename "$proof_file" .json)
        
        node ../contracts/build/src/blobstream/sp1_to_env.js \
            "$proof_file" \
            "$RUN_DIR" \
            "$WORK_DIR" \
            "$filename"
    else
        echo "No JSON files found in $PROOF_DIR."
    fi
done
