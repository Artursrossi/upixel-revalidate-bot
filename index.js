require("dotenv").config();
const axios = require("axios");

const discordChannelWebhook = process.env.DISCORD_WEBHOOK;
const clientExpirationDateTime = 1000 * 60 * 60 * 6; // 6 horas
const rconExpirationDateTime = 1000 * 60 * 60 * 12; // 12 horas

async function verifyClientExpirationDate() {
  try {
    const response = await axios.post(
      `https://www.upixel.store/api/revalidate/clientsExpirationDate`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status !== 200) throw new Error("Invalid Response Status");

    await axios.post(discordChannelWebhook, {
      content: `🟩 [upixel-revalidate] clientExpirationDate Successful Verification 🟩`,
    });
  } catch (error) {
    await axios.post(discordChannelWebhook, {
      content: `🟥 [upixel-revalidate] clientExpirationDate Error (${error}) 🟥`,
    });
  }
}

async function verifyRconExpirationDate() {
  try {
    const response = await axios.post(
      `https://www.upixel.store/api/revalidate/rconExpirationDate`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status !== 200) throw new Error("Invalid Response Status");

    await axios.post(discordChannelWebhook, {
      content: `🟩 [upixel-revalidate] rconExpirationDate Successful Verification 🟩`,
    });
  } catch (error) {
    await axios.post(discordChannelWebhook, {
      content: `🟥 [upixel-revalidate] rconExpirationDate Error (${error}) 🟥`,
    });
  }
}

async function main() {
  if (!process.env.DISCORD_WEBHOOK || !discordChannelWebhook)
    throw new Error("Env File Error: DISCORD_WEBHOOK is missing");

  await axios.post(discordChannelWebhook, {
    content: `🟦 [upixel-revalidate] Inicialização Bot de Revalidação do uPixel 🟦`,
  });
  console.log(
    `🟦 [upixel-revalidate] Inicialização Bot de Revalidação do uPixel 🟦`
  ); // Square Cloud Console

  await verifyClientExpirationDate();
  await verifyRconExpirationDate();

  setInterval(async () => {
    await verifyClientExpirationDate();
  }, clientExpirationDateTime);

  setInterval(async () => {
    await verifyRconExpirationDate();
  }, rconExpirationDateTime);
}

module.exports = main();
