require("dotenv").config();
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

function getRandomDelay(minMinutes, maxMinutes) {
  const minMilliseconds = minMinutes * 60 * 1000;
  const maxMilliseconds = maxMinutes * 60 * 1000;
  return (
    Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) +
    minMilliseconds
  );
}

async function navigateWithRetry(page, url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, options);
      return;
    } catch (error) {
      console.error(`導航失敗，重試 ${i + 1}/${retries}`, error);
      if (i === retries - 1) throw error;
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  let page;

  try {
    page = await browser.newPage();

    // 設置請求攔截以降低渲染負擔
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await navigateWithRetry(page, "https://imo.3t.org.tw/Login", {
      waitUntil: "networkidle0", // 等待所有網路連接結束
      timeout: 60000, // 設定 60 秒超時
    });
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
    await page.waitForNavigation({ timeout: 60000 }); // 增加導航超時時間
  } catch (error) {
    console.error("登入失敗", error);
    await browser.close();
    return;
  }

  try {
    await navigateWithRetry(page, "https://imo.3t.org.tw/FActive/Index/2756", {
      waitUntil: "networkidle0",
      timeout: 60000,
    }); // 直接導航到打卡頁面
  } catch (error) {
    console.error("導航打卡頁面失敗", error);
    await browser.close();
    return;
  }

  // 獲取當前時間
  const currentTime = new Date();
  const currentUTCHour = currentTime.getUTCHours();

  console.log("currentUTCHour:", currentUTCHour);

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

  const result = await page.evaluate(async (currentUTCHour) => {
    const signInButton = document.querySelector('[id^="SignIn_"]');
    const signOutButton = document.querySelector('[id^="SignOut_"]');

    if (signInButton) {
      signInButton.style.border = "2px solid red";
      if (currentUTCHour >= 0 && currentUTCHour < 1) {
        await signInButton.click();
      }
    }
    if (signOutButton) {
      signOutButton.style.border = "2px solid red";
      if (currentUTCHour >= 10 && currentUTCHour < 12) {
        await signOutButton.click();
      }
    }

    return {
      signInButtonExists: !!signInButton,
      signOutButtonExists: !!signOutButton,
    };
  }, currentUTCHour);

  if (result.signInButtonExists) {
    console.log("成功抓到 signInButton");
  }
  if (result.signOutButtonExists) {
    console.log("成功抓到 signOutButton");
  }
  // 確認簽到按鈕
  await page.waitForSelector('input[type="button"].is-premary', {
    visible: true,
    timeout: 60000, // 增加等待時間
  });
  await page.click('input[type="button"].is-premary');

  await browser.close();
})();
