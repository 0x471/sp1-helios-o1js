import {
  Field,
  PrivateKey,
  Provable,
  SmartContract,
  State,
  VerificationKey,
  method,
  state,
  Poseidon,
  UInt8,
  Bytes,
  Gadgets,
  ZkProgram,
  Struct,
  UInt64,
  Undefined,
  Bool,
} from 'o1js';

import { FrC } from './ForeignField.js';
import { NodeProofLeft } from './structs.js';
import { parsePublicInputsProvable } from '../o1js-blobstream/contracts/src/plonk/parse_pi.js';
import { wordToBytes } from '../o1js-blobstream/contracts/src/sha/utils.js';
// import { wordToBytes } from 'o1js/src/lib/provable/gadgets/bit-slices.js';
// import { wordToBytes } from 'o1js/dist/node/lib/provable/gadgets/bit-slices.js';
import fs from 'fs';

class Bytes32 extends Bytes(32) {}

/// bytes32 prevHeader;
/// bytes32 newHeader;
/// bytes32 syncCommitteeHash;
/// bytes32 nextSyncCommitteeHash;
/// uint256 prevHead;
/// uint256 newHead;
/// bytes32 executionStateRoot;
// pub type ProofOutputs = sol! {
//   tuple(bytes32, bytes32, bytes32, bytes32, uint256, uint256, bytes32)
// };
class EthInput extends Struct({
  prevHeader: Bytes32.provable,
  newHeader: Bytes32.provable,
  syncCommitteeHash: Bytes32.provable,
  nextSyncCommitteeHash: Bytes32.provable,
  prevHead: UInt64,
  newHead: UInt64,
  executionStateRoot: Bytes32.provable,
}) {}
const EthVerifier = ZkProgram({
  name: 'EthVerifier',
  publicInput: EthInput,
  publicOutput: Undefined,
  methods: {
    compute: {
      privateInputs: [NodeProofLeft],
      async method(input: EthInput, proof: NodeProofLeft) {
        // if (process.env.BLOBSTREAM_ENABLED == 'true') {
        // ethProgramVK = FrC.from(process.env.BLOBSTREAM_PROGRAM_VK as string);
        const ethPlonkVK = FrC.from(
          '390547576473534316791910310374008053222910185241794456152644305216397560817' //$programVK todo check ?
        );
        // const workDir = process.env.BLOBSTREAM_WORK_DIR as string;
        const ethNodeVk = Field.from(
          JSON.parse(
            fs.readFileSync(
              `/home/karol/Documents/sp1-helios-o1js/src/proofs/p0.json`,
              'utf8'
            )
          ).publicOutput[2]
        );

        const vk = VerificationKey.fromJSON(
          JSON.parse(
            fs.readFileSync(
              `/home/karol/Documents/sp1-helios-o1js/src/proofs/nodeVk.json`,
              'utf8'
            )
          )
        );

        proof.verify(vk);
        proof.publicOutput.subtreeVkDigest.assertEquals(ethNodeVk);
        Provable.log('all', input);
        Provable.log('newHeader', input.newHeader);
        Provable.log('newHead slot', input.newHead);

        let bytes: UInt8[] = [];
        bytes = bytes.concat(input.prevHeader.bytes);
        bytes = bytes.concat(input.newHeader.bytes);
        bytes = bytes.concat(input.syncCommitteeHash.bytes);
        bytes = bytes.concat(input.nextSyncCommitteeHash.bytes);
        bytes = bytes.concat(padUInt64To32Bytes(input.prevHead)); // todo doesnt work?
        bytes = bytes.concat(padUInt64To32Bytes(input.newHead));

        // bytes = bytes.concat(uint64ToBytes32(input.prevHead));
        // bytes = bytes.concat(uint64ToBytes32(input.newHead));
        bytes = bytes.concat(input.executionStateRoot.bytes);

        const pi0 = ethPlonkVK;
        const pi1 = parsePublicInputsProvable(Bytes.from(bytes));

        const piDigest = Poseidon.hashPacked(Provable.Array(FrC.provable, 2), [
          pi0,
          pi1,
        ]);
        piDigest.assertEquals(proof.publicOutput.rightOut);

        return undefined;
      },
    },
  },
});

const EthProof = ZkProgram.Proof(EthVerifier);
export { EthVerifier, EthProof, EthInput, Bytes32 };

const padUInt64To32Bytes = (num: UInt64): UInt8[] => {
  let unpadded: UInt8[] = [];
  Provable.asProver(() => {
    unpadded = wordToBytes(num.toFields()[0]);
  });
  return [...unpadded, ...Array(24).fill(UInt8.from(0))].reverse();
};
