import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, bytesToHex } from "ethereum-cryptography/utils";

interface ProofNode {
  data: string;
  left: boolean;
}

const concat = (left: Uint8Array, right: Uint8Array): Uint8Array =>
  keccak256(Buffer.concat([left, right]));

function verifyProof(proof: ProofNode[], leaf: string, root: string): boolean {
  const proofWithBytes = proof.map(({ data, left }) => ({
    left,
    data: hexToBytes(data),
  }));
  let data = keccak256(Buffer.from(leaf));

  for (let i = 0; i < proofWithBytes.length; i++) {
    if (proofWithBytes[i].left) {
      data = concat(proofWithBytes[i].data, data);
    } else {
      data = concat(data, proofWithBytes[i].data);
    }
  }

  return bytesToHex(data) === root;
}

export default verifyProof;
