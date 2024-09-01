require("dotenv").config();
const puppeteer = require("puppeteer");

async function autoCheckIn() {
  // 確認環境變數是否成功引入
  console.log("CHECKIN_USERNAME:", process.env.CHECKIN_USERNAME);
  console.log("CHECKIN_PASSWORD:", process.env.CHECKIN_PASSWORD);

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://imo.3t.org.tw/Login");

    // 登入
    await page.type("#ID", process.env.CHECKIN_USERNAME);
    await page.type("#PW", process.env.CHECKIN_PASSWORD);
    await page.click("#loginBtn");
    await page.waitForNavigation();

    await page.goto("https://imo.3t.org.tw/FActive/Index/2756"); // 直接導航到打卡頁面

    // // 打卡
    // await page.click("#checkin-button");
    // await page.waitForSelector("#success-message");

    // 將打卡按鈕添加邊框
    await page.evaluate(() => {
      // const checkinButton = document.querySelector("#checkin-button");
      const element = document.querySelector(
        'a[href="/FActive/Detail/2756/25930?Q_SMS=0"].font.font-people.btn.is-premary.phonebtn[disabled="disabled"]'
      );
      element.style.border = "2px solid red";
    });

    // 確認元素可見
    await page.waitForSelector(
      'a[href="/FActive/Detail/2756/25930?Q_SMS=0"].font.font-people.btn.is-premary.phonebtn[disabled="disabled"]',
      { visible: true }
    );
    console.log("打卡成功");
  } catch (error) {
    console.error("打卡失敗", error);
  } finally {
    // await browser.close();
  }
}

autoCheckIn();
