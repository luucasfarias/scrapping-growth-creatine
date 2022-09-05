const cron = require('node-cron');
const puppeteer = require('puppeteer');
const twilio = require('twilio');

const url = 'https://www.gsuplementos.com.br/creatina-monohidratada-250gr-growth-supplements-p985931';
const urlSecondary = 'https://www.gsuplementos.com.br/bcaa-2-1-1-200g-em-po-growth-supplements-p985949';

async function checkGrowth() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  const text = await page.$eval(".boxFinalizarCompra > a > button", element => element.textContent);

  const result = await findWord('COMPRAR', text);

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
  var client = new twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

  // Send the text message. 
  client.messages.create({
    to: '',
    from: '',
    body: message
  });
}


cron.schedule('0 */5 * * * *', async () => {
  console.log('running a task every minute');
  await checkGrowth();
});