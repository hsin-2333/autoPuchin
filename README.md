## 專案描述

使用 Puppeteer 和 Chromium 的自動打卡腳本。
該腳本會自動登入指定的網站，並根據當前的 UTC 時間自動點擊簽到或簽退按鈕。

## 前置作業
* !直接 fork 後使用 [Render 的 Cron Job](https://dashboard.render.com/) 部署
* 需要先掏出魔法小卡預付30元台幣
* 也可以去研究如何使用 Cloud functions, AWS lamdba 部署~
![Cron Job](https://imgur.com/LZyfDXg.png)

<br/>


## Render 上該怎麼設定 
![設定](https://imgur.com/t4tWswa.png)
![環境變數 env](https://imgur.com/einvHq8.png)

* 執行腳本（Command）：
    ```bash
    node checkIn.js
    ```
* 建構指令（Build Command）：
	```bash
    npm install
    ```
* Schedule：
	* 一天打卡兩次：台北時間早上08:35分、下午6:35分(時間請自行替換)
	* ``` 35 00,10 * * 1-5```
	* 注意：Render 使用的是 UTC 時間，所以這邊是用00:35, 10:35
* Environment 記得設置以下環境變數：
    ```plaintext
    CHECKIN_USERNAME=<登入帳號>
    CHECKIN_PASSWORD=<登入密碼>
    ```

## 未來可精進部分

- [`getRandomDelay(minMinutes, maxMinutes)`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FUSER%2F2024.09.01%20auto-checkin%2FcheckIn.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A4%2C%22character%22%3A9%7D%7D%5D%2C%22df936685-ddff-4cad-b3f7-3b698a6de68d%22%5D "Go to definition"): 生成一個隨機的延遲時間()。


## 注意事項

- 請確保 [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FUSER%2F2024.09.01%20auto-checkin%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22df936685-ddff-4cad-b3f7-3b698a6de68d%22%5D "c:\Users\USER\2024.09.01 auto-checkin\.env") 文件中的帳號和密碼正確無誤。
- 此腳本僅供學習和測試使用，請勿用於非法用途。
- 投資一定有風險，基金投資有賺有賠，申購前應詳閱公開說明書
