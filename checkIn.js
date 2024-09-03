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

async function autoCheckIn() {
  // 確認環境變數是否成功引入
  console.log("CHECKIN_USERNAME:", process.env.CHECKIN_USERNAME);
  console.log("CHECKIN_PASSWORD:", process.env.CHECKIN_PASSWORD);

  const browser = await puppeteer.launch({
    headless: true,
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

    //確認簽到按鈕
    // await page.waitForSelector('input[type="button"].is-premary', {
    //   visible: true,
    // });
    // await page.click('input[type="button"].is-premary');

    // 確認元素可見並添加邊框
    await page.evaluate(() => {
      const signInButton = document.querySelector('[id^="SignIn_"]');
      const signOutButton = document.querySelector('[id^="SignOut_"]');

      if (signInButton) {
        signInButton.style.border = "2px solid red";
      }
      if (signOutButton) {
        signOutButton.style.border = "2px solid red";
      }
    });

    // // 確認元素可見
    // await page.waitForSelector('[id^="SignIn_"][disabled="disabled"]', {
    //   visible: true,
    // });
    console.log("打卡成功");
  } catch (error) {
    console.error("打卡失敗", error);
  } finally {
    await browser.close();
  }
}

autoCheckIn();
