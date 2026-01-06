import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, bytesToHex } from "ethereum-cryptography/utils";

interface ProofNode {
  data: string;
  left: boolean;
}

function verifyProof(proof: ProofNode[], leaf: string, root: string): boolean {
  let currentHash = keccak256(Buffer.from(leaf));

  for (const node of proof) {
    const siblingHash = hexToBytes(node.data);

    currentHash = node.left
      ? keccak256(Buffer.concat([siblingHash, currentHash]))
      : keccak256(Buffer.concat([currentHash, siblingHash]));
  }

  return bytesToHex(currentHash) === root;
}

export default verifyProof;
