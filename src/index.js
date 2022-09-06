import { schedule } from 'node-cron';
import { launch } from 'puppeteer';
import twilio from 'twilio';
// require('env').env();
require('dotenv').config();

const url = 'https://www.gsuplementos.com.br/creatina-monohidratada-250gr-growth-supplements-p985931';
const urlSecondary = 'https://www.gsuplementos.com.br/bcaa-2-1-1-200g-em-po-growth-supplements-p985949';

async function checkGrowth() {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(urlSecondary);
  
  const text = await page.$eval(".boxFinalizarCompra > a > button", element => element.textContent);

  const result = await findWord('COMPRAR', text);

  console.log(result);

  if (result > 0) {
    await sendMessage('Corre la... Creatina disponivel para compra');
  } else {
    console.log('nao esta disponivel pra comprar');
  }

  await browser.close();
}

async function findWord(word, str) {
  return str.search(word);
}

async function sendMessage(message) {
  var client = new twilio(`${process.env.TWILIO_ACCOUNT_SID}`, `${process.env.TWILIO_AUTH_TOKEN}`);

  // Send the text message. 
  client.messages.create({
    to: `${process.env.YOUR_NUMBER}`,
    from: `${process.env.TWILIO_NUMBER}`,
    body: message
  });
}

schedule('0 */1 * * * *', async () => {
  console.log('running a task every minute');
  await checkGrowth();
});