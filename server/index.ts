import express, { Request, Response } from "express";
import verifyProof from "../utils/verifyProof";
import { MerkleTree } from "../utils/MerkleTree";
import niceList from "../utils/niceList.json";

const port = 1225;
const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();

const app = express();

app.use(express.json());

interface GiftRequest {
  name: string;
  proof: Array<{ data: string; left: boolean }>;
}

app.post("/gift", (req: Request<{}, string, GiftRequest>, res: Response) => {
  const body = req.body;

  const isInTheList = verifyProof(body.proof, body.name, MERKLE_ROOT);

  if (isInTheList) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.get("/proof", (req: Request, res: Response) => {
  const name = req.query.name as string;

  if (!name) {
    res.status(400).send("Bad request");
    return;
  }

  const index = niceList.findIndex((n) => n === name);

  if (index === -1) {
    res.status(403).send("Unauthorized");
    return;
  }

  const proof = merkleTree.getProof(index);

  res.send(proof);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
