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

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let page;

  try {
    page = await browser.newPage();
    await page.goto("https://imo.3t.org.tw/Login");
  } catch (error) {
    console.error("導航失敗", error);
    await browser.close();
    return; // 如果導航失敗，結束程式
  }

  try {
    // 登入
    await page.type("#ID", process.env.CHECKIN_USERNAME);
    await page.type("#PW", process.env.CHECKIN_PASSWORD);
    await page.click("#loginBtn");
    await page.waitForNavigation();
  } catch (error) {
    console.error("登入失敗", error);
    await browser.close();
    return;
  }

  try {
    await page.goto("https://imo.3t.org.tw/FActive/Index/2756"); // 直接導航到打卡頁面
  } catch (error) {
    console.error("導航打卡頁面失敗", error);
    await browser.close();
    return;
  }

  // 獲取當前時間
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  console.log("currentHour:", currentHour);

  // 這裡是你的簽到/簽退邏輯

  await page
    .waitForFunction(() => !!document.querySelector('[id^="SignIn_"]'), {
      timeout: 5000,
    })
    .then(() => {
      console.log("SignIn 按鈕出現了！");
    })
    .catch(() => {
      console.log("等待 SignIn 按鈕超時。");
    });

  const result = await page.evaluate(() => {
    const signInButton = document.querySelector('[id^="SignIn_"]');
    const signOutButton = document.querySelector('[id^="SignOut_"]');

    if (signInButton) {
      signInButton.style.border = "2px solid red";
    }
    if (signOutButton) {
      signOutButton.style.border = "2px solid red";
    }

    return {
      signInButtonExists: !!signInButton,
      signOutButtonExists: !!signOutButton,
    };
  });

  if (result.signInButtonExists) {
    console.log("成功抓到 signInButton");
  }
  if (result.signOutButtonExists) {
    console.log("成功抓到 signOutButton");
  }

  await browser.close();
})();
