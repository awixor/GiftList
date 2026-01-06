import { keccak256 } from "ethereum-cryptography/keccak";
import { bytesToHex } from "ethereum-cryptography/utils";

export class MerkleTree {
  private layers: Uint8Array[][];

  constructor(leaves: string[]) {
    // [[H(A), H(B), H(C), H(D)]] => [[Root], [H(A+B), H(C+D)], [H(A), H(B), H(C), H(D)]]
    this.layers = [leaves.map((leaf) => keccak256(Buffer.from(leaf)))];

    // Build the tree upwards until we reach the root
    while (this.layers[0].length > 1) {
      this.layers.unshift(this.getNextLayer(this.layers[0]));
    }
  }

  private getNextLayer(nodes: Uint8Array[]): Uint8Array[] {
    const layer: Uint8Array[] = [];

    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1];

      // If no right sibling exists, move the left node up; otherwise, hash the pair
      if (right) layer.push(keccak256(Buffer.concat([left, right])));
      else layer.push(left);
    }

    return layer;
  }

  getRoot(): string {
    return bytesToHex(this.layers[0][0]);
  }

  getProof(index: number): { data: string; left: boolean }[] {
    const proof: { data: string; left: boolean }[] = [];
    let layerIdx = this.layers.length - 1; // Start from leaves

    while (layerIdx > 0) {
      const layer = this.layers[layerIdx];
      const isRightSibling = index % 2 !== 0;
      const pairIndex = isRightSibling ? index - 1 : index + 1;

      // prevent no right sibling error
      if (pairIndex < layer.length) {
        proof.push({
          data: bytesToHex(layer[pairIndex]),
          left: isRightSibling,
        });
      }

      index = Math.floor(index / 2);
      layerIdx--;
    }
    return proof;
  }
}
