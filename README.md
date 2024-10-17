
# SP1-Helios-o1js

### 1. Create `.env` File
Create a `.env` file in the `sp1-helios` directory. Follow the instructions provided in the [SP1-Helios documentation](https://github.com/succinctlabs/sp1-helios#4-run-light-client) for the required environment variables.

### 2. Run the Operator
Run the operator by executing the following command:

```bash
./run_operator
```

Wait for the process to generate and write a proof in the `./sp1-helios-proofs` directory.

### 3. Convert Proofs
Once the proofs start to get generated, execute the `convert_proofs.sh` script to convert them:
```bash
./convert_Proofs.sh
```

### 4. Verify Proofs
WIP

---

For further details, please refer to the official [SP1-Helios documentation](https://github.com/succinctlabs/sp1-helios).
