import {
  AccountUpdate,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  Cache,
  verify,
  UInt64,
  VerificationKey,
} from 'o1js';
import { EthProcessor } from './EthProcessor';
import { EthVerifier, EthInput, Bytes32 } from './EthVerifier';
import fs from 'fs';
import { NodeProofLeft } from '../structs';
import { ethers } from 'ethers';
import { PATH_TO_O1_PROOF, PATH_TO_SP1_PROOF } from './proofs';
let proofsEnabled = true;

describe('EthProcessor', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: EthProcessor,
    vk: VerificationKey;

  beforeAll(async () => {
    vk = (await EthVerifier.compile({ cache: Cache.FileSystemDefault }))
      .verificationKey;

    if (proofsEnabled) await EthProcessor.compile();
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new EthProcessor(zkAppAddress);

    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  });

  it('correctly updates the num state on the `Add` smart contract', async () => {
    const rawProof = await NodeProofLeft.fromJSON(
      JSON.parse(fs.readFileSync(PATH_TO_O1_PROOF, 'utf8'))
    );
    // rawProof.publicInput;
    const ethSP1Proof = JSON.parse(fs.readFileSync(PATH_TO_SP1_PROOF, 'utf8'));
    const defaultEncoder = ethers.AbiCoder.defaultAbiCoder();
    const decoded = defaultEncoder.decode(
      [
        'bytes32',
        'bytes32',
        'bytes32',
        'uint64',
        'bytes32',
        'uint64',
        'bytes32',
      ],
      Buffer.from(ethSP1Proof.public_values.buffer.data)
    );

    const input = new EthInput({
      executionStateRoot: Bytes32.fromHex(decoded[0].slice(2)),
      newHeader: Bytes32.fromHex(decoded[1].slice(2)),
      nextSyncCommitteeHash: Bytes32.fromHex(decoded[2].slice(2)),
      newHead: UInt64.from(decoded[3]),
      prevHeader: Bytes32.fromHex(decoded[4].slice(2)),
      prevHead: UInt64.from(decoded[5]),
      syncCommitteeHash: Bytes32.fromHex(decoded[6].slice(2)),
    });

    const proof = await EthVerifier.compute(input, rawProof);
    const valid = await verify(proof, vk);
    console.log('verified in zkProgram?', valid);
    // const ethProof = await ethVerifier.compute();

    // update transaction
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.mockUpdate(proof);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    // const updatedNum = zkApp.num.get();
    // expect(updatedNum).toEqual(Field(3));
  });
});
