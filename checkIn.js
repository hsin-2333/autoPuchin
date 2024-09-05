require("dotenv").config();
const puppeteer = require("puppeteer");

function getRandomDelay(minMinutes, maxMinutes) {
  const minMilliseconds = minMinutes * 60 * 1000;
  const maxMilliseconds = maxMinutes * 60 * 1000;
  return (
    Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) +
    minMilliseconds
  );
}

const puppeteer = require("puppeteer"); // 使用 Puppeteer 內置的 Chromium

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://imo.3t.org.tw/Login");
  } catch (error) {
    console.error("導航失敗", error);
  }

  // 登入
  await page.type("#ID", process.env.CHECKIN_USERNAME);
  await page.type("#PW", process.env.CHECKIN_PASSWORD);
  await page.click("#loginBtn");
  await page.waitForNavigation();

  try {
    await page.goto("https://imo.3t.org.tw/FActive/Index/2756"); // 直接導航到打卡頁面
  } catch (error) {
    console.error("導航打卡頁面失敗", error);
  }

  // 獲取當前時間
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  console.log("currentHour:", currentHour);

  // 點擊簽到或簽退按鈕
  // if (currentHour >= 8 && currentHour < 9) {
  //   const delay = getRandomDelay(1, 3);
  //   await new Promise((resolve) => setTimeout(resolve, delay));
  //   const signInButton = await page.$('[id^="SignIn_"]');
  //   if (signInButton) {
  //     await signInButton.click();
  //   }
  // } else if (currentHour >= 18 && currentHour < 20) {
  //   const delay = getRandomDelay(1, 10);
  //   console.log("delay:", delay);
  //   await new Promise((resolve) => setTimeout(resolve, delay));
  //   const signOutButton = await page.$('[id^="SignOut_"]');
  //   if (signOutButton) {
  //     await signOutButton.click();
  //   }
  // }

  // 確認簽到按鈕
  // await page.waitForSelector('input[type="button"].is-premary', {
  //   visible: true,
  // });

  await page.evaluate(() => {
    const signInButton = document.querySelector('[id^="SignIn_"]');
    const signOutButton = document.querySelector('[id^="SignOut_"]');

    if (signInButton) {
      signInButton.style.border = "2px solid red";
      console.log("成功抓到 signInButton:", signInButton);
    }
    if (signOutButton) {
      signOutButton.style.border = "2px solid red";
      console.log("成功抓到 signOutButton:", signOutButton);
    }
  });

  await browser.close();
})();
