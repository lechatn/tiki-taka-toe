import fetch from "node-fetch";

const APIkey =
  "e5c31b3ed1377a20e949cb115bcfb3bd6fd558d9e57a63afa0916d392a25d255";
const league_id = 3;

const curl_options = {
  url:
    `https://apiv3.apifootball.com/?action=get_teams&league_id=${league_id}&APIkey=${APIkey}`,
  method: "GET",
  timeout: 30000,
  connectTimeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

fetch(curl_options.url, {
  method: curl_options.method,
  timeout: curl_options.timeout,
  connectTimeout: curl_options.connectTimeout,
  headers: curl_options.headers,
})
  .then((response) => response.json())
  .then((result) => {
    return Deno.writeTextFile(
      "championsLeague.json",
      JSON.stringify(result, null, 2),
    );
  })
  .catch((error) => {
    console.error("Error:", error);
  });
