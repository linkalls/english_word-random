import { Hono } from "hono";
import { html } from "hono/html";
import data from "./NGSL.json";

const app = new Hono();

// HTMLレスポンスを返す関数
const renderHTML = (item: any) => {
  return html`
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>英単語 - ランダム</title>
        <style>
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .container {
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
            max-width: 600px;
            width: 90%;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }

          h1 {
            color: #2c3e50;
            font-size: 2.25rem;
            margin-bottom: 1.25rem;
            font-weight: 500;
            line-height: 1.2;
            transition: color 0.3s ease;
          }
          .dark-mode h1 {
            color: #7fdbff;
          }
          .button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            margin: 0.5rem;
            font-size: 1.125rem;
            font-weight: 500;
            line-height: 1.2;
          }

          .button:hover {
            background-color: #2980b9;
          }
          .hint,
          .answer {
            margin-top: 1rem;
            font-size: 1.125rem;
            line-height: 1.6;
            display: block;
            color: #555;
            transition: color 0.3s ease;
          }
          .hint.dark-mode,
          .answer.dark-mode {
            color: #cccccc;
          }
          .hidden {
            display: none;
          }
          .footer {
            margin-top: 1.5rem;
            font-size: 0.875rem;
            color: #777;
            transition: color 0.3s ease;
          }
          .ad-container {
            margin: 1.5rem 0;
            text-align: center;
            width: 100%;
            
          }
          @media (max-width: 768px) {
            .pc-ad {
              display: none;
            }
          }
          @media (min-width: 769px) {
            .mobile-ad {
              display: none;
            }
          }
        </style>
      </head>
      <body id="body">
        <div class="container" id="container">
        <div class="ad-container mobile-ad">
            <!-- スマホ用広告 -->
            <script src="https://adm.shinobi.jp/s/bd41671b445805e39432f97d6352b3ce"></script>
          </div>

          <div class="ad-container pc-ad">
            <!-- PC用広告 -->
            <script src="https://adm.shinobi.jp/s/fcd73dd702b402fd19fa059fad64f101"></script>
          </div>

          <h1 class="text-3xl font-bold">${item.subject}</h1>

          <button
            class="button"
            onclick="document.getElementById('hint').classList.toggle('hidden');"
          >
            ヒントを表示
          </button>
          <div id="hint" class="hint hidden">${item.hint}</div>
          <button
            class="button"
            onclick="document.getElementById('answer').classList.toggle('hidden');"
          >
            答えを表示
          </button>
          <div id="answer" class="answer hidden">${item.answer}</div>

          <div class="footer">
            <p>NGSL データ</p>
            <p>
              この作品は<a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                >クリエイティブ・コモンズ 表示 - 継承 4.0 国際 ライセンス</a
              >の下に提供されています。
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

app.get("/", (c) => {
  // ランダムに1つを選択
  const randomItem = data[Math.floor(Math.random() * data.length)];

  // Acceptヘッダーを確認してレスポンス形式を選択
  const acceptHeader = c.req.header("Accept");

  if (acceptHeader?.includes("application/json")) {
    // JSON形式で返す
    return c.json(randomItem);
  }

  // Honoのhtmlミドルウェアを使ってHTMLを生成して返す
  const htmlString = renderHTML(randomItem);
  return c.html(htmlString);
});

export default app;
