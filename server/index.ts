import express, { Request, Response } from "express";
import verifyProof from "../utils/verifyProof";

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = "";

interface GiftRequest {
  name: string;
  proof: Array<{ data: string; left: boolean }>;
}

app.post("/gift", (req: Request<{}, string, GiftRequest>, res: Response) => {
  // grab the parameters from the front-end here
  const body = req.body;

  // TODO: prove that a name is in the list
  const isInTheList = verifyProof(body.proof, body.name, MERKLE_ROOT);
  if (isInTheList) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
