import { Hono } from "hono";
import { html } from "hono/html";
import data from "./NGSL.json";

// SVGファイルを文字列として定義
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- 背景のグラデーション -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6F61;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="50" cy="50" r="45" fill="url(#grad1)" />
  
  <!-- 複数のランダムな丸 -->
  <circle cx="35" cy="25" r="8" fill="white" opacity="0.8"/>
  <circle cx="70" cy="40" r="6" fill="white" opacity="0.8"/>
  <circle cx="45" cy="65" r="10" fill="white" opacity="0.8"/>
  
  <!-- 中央にシンプルでおしゃれな英単語 -->
  <text x="50%" y="50%" font-size="18" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold" dy=".3em">Word</text>
</svg>
`;

// SVGをData URI形式に変換
const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  svgIcon
)}`;

interface Word {
  subject: string;
  hint: string;
  answer: string;
}

const app = new Hono();

// HTMLレスポンスを返す関数
const renderHTML = (item: Word) => {
  return html`
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="英単語のランダムな問題を出題するサイトです。"
        />
        <link rel="icon" href="${svgDataUri}" sizes="48x48" />
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

          .next-button {
            background-color: #9b59b6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin: 1rem 0.5rem;
            font-size: 1.125rem;
            font-weight: 500;
            line-height: 1.2;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .next-button:hover {
            background-color: #8e44ad;
          }
          
          .next-button svg {
            margin-left: 0.5rem;
            width: 16px;
            height: 16px;
          }

          .next-button[disabled] {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .audio-button {
            background-color: #27ae60;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin: 0.5rem;
            font-size: 1rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .audio-button:hover {
            background-color: #219653;
          }

          .audio-button svg {
            margin-right: 0.5rem;
            width: 16px;
            height: 16px;
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
          
          .button-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 1rem 0;
          }
          
          .loader {
            border: 3px solid #f3f3f3;
            border-radius: 50%;
            border-top: 3px solid #9b59b6;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-left: 0.5rem;
            display: none;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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

          <h1 class="text-3xl font-bold" id="word-subject">${item.subject}</h1>

          <button
            class="audio-button"
            onclick="speakWord(document.getElementById('word-subject').innerText)"
            title="発音を聞く"
            id="speak-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            発音を聞く
          </button>

          <div class="button-container">
            <button
              class="button"
              onclick="toggleHint()"
              id="hint-button"
            >
              ヒントを表示
            </button>
            <button
              class="button"
              onclick="toggleAnswer()"
              id="answer-button"
            >
              答えを表示
            </button>
          </div>
          
          <div id="hint" class="hint hidden"></div>
          <div id="answer" class="answer hidden"></div>
          
          <button
            class="next-button"
            onclick="fetchNextWord()"
            id="next-button"
          >
            次の単語へ
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div class="loader" id="loader"></div>
          </button>

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

        <script>
          // 現在の単語データを保持するグローバル変数
          let currentWord = {
            subject: "${item.subject}",
            hint: "${item.hint}",
            answer: "${item.answer}"
          };
          
          // 初期表示時に一度だけ行う設定
          document.addEventListener('DOMContentLoaded', function() {
            // ヒントと答えを設定
            document.getElementById('hint').innerText = currentWord.hint;
            document.getElementById('answer').innerText = currentWord.answer;
          });
          
          // 次の単語を取得する関数
          async function fetchNextWord() {
            // ボタンを無効化
            const nextButton = document.getElementById('next-button');
            nextButton.disabled = true;
            
            // ローダーを表示
            const loader = document.getElementById('loader');
            loader.style.display = 'inline-block';
            
            try {
              // JSONデータをフェッチ
              const response = await fetch('/', {
                headers: {
                  'Accept': 'application/json'
                }
              });
              
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              
              // JSONデータを解析
              const data = await response.json();
              
              // グローバル変数を更新
              currentWord = data;
              
              // UI要素を更新
              document.getElementById('word-subject').innerText = data.subject;
              document.getElementById('hint').innerText = data.hint;
              document.getElementById('answer').innerText = data.answer;
              
              // ヒントと答えを隠す
              document.getElementById('hint').classList.add('hidden');
              document.getElementById('answer').classList.add('hidden');
              
              // ヒントと答えのボタンのテキストを戻す
              document.getElementById('hint-button').innerText = 'ヒントを表示';
              document.getElementById('answer-button').innerText = '答えを表示';
              
            } catch (error) {
              console.error('単語の取得に失敗しました:', error);
              alert('新しい単語の取得に失敗しました。もう一度お試しください。');
            } finally {
              // ボタンを再度有効にする
              nextButton.disabled = false;
              
              // ローダーを非表示
              loader.style.display = 'none';
            }
          }
          
          // Web Speech APIを使って単語を発音する関数
          function speakWord(word) {
            // Web Speech APIのサポートチェック
            if ("speechSynthesis" in window) {
              // 発音を停止（既に話している場合）
              window.speechSynthesis.cancel();

              // 新しい発話オブジェクトを作成
              const utterance = new SpeechSynthesisUtterance(word);

              // 英語の声を設定
              utterance.lang = "en-US";

              // 声のピッチと速度を設定
              utterance.pitch = 1;
              utterance.rate = 0.9;

              // 利用可能な音声のリストを取得
              const voices = window.speechSynthesis.getVoices();

              // 英語の音声を探す
              let englishVoice = voices.find(
                (voice) =>
                  voice.lang.includes("en") &&
                  (voice.name.includes("Google") ||
                    voice.name.includes("English"))
              );

              // 英語の音声が見つかれば設定
              if (englishVoice) {
                utterance.voice = englishVoice;
              }

              // 発音開始
              window.speechSynthesis.speak(utterance);
            } else {
              alert("お使いのブラウザはWeb Speech APIに対応していません。");
            }
          }
          
          // ヒントの表示/非表示を切り替える関数
          function toggleHint() {
            const hintElement = document.getElementById('hint');
            hintElement.classList.toggle('hidden');
            
            // ボタンのテキストを変更
            const hintButton = document.getElementById('hint-button');
            if (hintElement.classList.contains('hidden')) {
              hintButton.innerText = 'ヒントを表示';
            } else {
              hintButton.innerText = 'ヒントを隠す';
              // 表示された場合は音声を再生
              // setTimeout(() => speakWord(currentWord.hint), 300);
            }
          }
          
          // 答えの表示/非表示を切り替える関数
          function toggleAnswer() {
            const answerElement = document.getElementById('answer');
            answerElement.classList.toggle('hidden');
            
            // ボタンのテキストを変更
            const answerButton = document.getElementById('answer-button');
            if (answerElement.classList.contains('hidden')) {
              answerButton.innerText = '答えを表示';
            } else {
              answerButton.innerText = '答えを隠す';
              // 表示された場合は音声を再生するわけじゃない
              // setTimeout(() => speakWord(currentWord.answer), 300);
            }
          }

          // 音声のリストが非同期でロードされるため、初期化時に一度取得しておく
          window.onload = function () {
            if ("speechSynthesis" in window) {
              window.speechSynthesis.getVoices();
            }
          };

          // 音声リストが変更された場合に再取得
          if ("speechSynthesis" in window) {
            speechSynthesis.onvoiceschanged = function () {
              window.speechSynthesis.getVoices();
            };
          }
        </script>
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