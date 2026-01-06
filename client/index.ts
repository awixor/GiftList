import axios from "axios";

const serverUrl = "http://localhost:1225";

async function main() {
  const name = "Mr. Janice Ryan";

  const { data: proof } = await axios.get(`${serverUrl}/proof?name=${name}`);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof,
    name,
  });

  console.log({ gift });
}

main();
