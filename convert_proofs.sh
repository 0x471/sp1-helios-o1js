#!/bin/bash

# Navigate to the scripts folder
cd ~/Documents/all/dev/sp1-helios-o1js/o1js-blobstream/scripts || exit

# Set environment variables
export WORK_DIR=run-e2e-sp1helios
export RUN_DIR=$(pwd)/$WORK_DIR
export PROOF_DIR=../../sp1-helios/data/proofs

# Create the RUN_DIR if it does not exist
mkdir -p "$RUN_DIR"

# Iterate through each JSON file in the PROOF_DIR
for proof_file in $PROOF_DIR/*.json; do
    if [[ -f "$proof_file" ]]; then
        filename=$(basename "$proof_file" .json)
        
        # Execute the Node.js script for each proof.json file
        if node ../contracts/build/src/blobstream/sp1_to_env.js \
            "$proof_file" \
            "$RUN_DIR" \
            "$WORK_DIR" \
            "$filename"; then

            ./e2e_plonk.sh "$RUN_DIR/env.$filename"
        else
            echo "Error executing sp1_to_env.js for $proof_file."
        fi
    else
        echo "No JSON files found in $PROOF_DIR."
    fi
done
