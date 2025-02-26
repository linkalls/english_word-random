import fs from 'fs';

// JSONファイルのパス
const filePath = './NGSL.json';

async function removeFields() {
  try {
    // JSONファイルの読み込み
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    // 各オブジェクトから不要なフィールドを削除
    const updatedData = data.map((item: any) => {
      const { trialNumber, correctNumber, history, ...rest } = item;
      return rest;
    });

    // 更新されたデータをファイルに書き込み
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    console.log('フィールドが削除されました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

removeFields();
