const key = "d5b898c3d069b4f93f4e55271c7c953d";
const model = "openai/gpt-4.1-mini"; // Using exactly what user provided
const url = `https://api.bytez.com/models/v2/${model}`;

async function testFetch() {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Key ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: [
        { role: "user", content: "Hello" }
      ]
    })
  });
  const text = await response.text();
  console.log("Raw Response:");
  console.log(text);
}

testFetch();
