const key = "d5b898c3d069b4f93f4e55271c7c953d";
const model = "openai/gpt-4o-mini"; // Using standard gpt-4o-mini just in case
const url = `https://api.bytez.com/models/v2/${model}`;

async function testFetch() {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Key ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: [
        { role: "user", content: "Hello" }
      ]
    })
  });
  const data = await response.json();
  console.log("Status:", response.status);
  console.dir(data, {depth: null});
}

testFetch();
