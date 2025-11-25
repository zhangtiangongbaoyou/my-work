const https = require('https');

const options = [
  { url: 'https://push2.eastmoney.com/api/qt/stock/trends2/get?secid=0.002594&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&iscr=0&ndays=1', reason: '比亚迪 汽车龙头' },
  { url: 'https://push2.eastmoney.com/api/qt/stock/trends2/get?secid=0.300750&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&iscr=0&ndays=1', reason: '宁德时代 电池王者' },
  // 你可以继续加你喜欢的票，格式一样就行
];

async function fetchStock(code) {
  return new Promise(resolve => {
    https.get(`https://push2.eastmoney.com/api/qt/stock/get?secid=0.${code}&fields=f43,f57,f58,f162,f167,f43`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const info = json.data;
          if (info) {
            resolve({
              code,
              name: info.f58,
              price: info.f43 / 1000,
              change: info.f162 / 100,
              reason: '高增长潜力股'
            });
          }
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

exports.main_handler = async () => {
  const stocks = [
    {code: '002594', name: '比亚迪', reason: '新能源车龙头'},
    {code: '300750', name: '宁德时代', reason: '动力电池全球第一'},
    {code: '300274', name: '阳光电源', reason: '逆变器龙头'},
    {code: '002371', name: '北方华创', reason: '半导体设备国产替代'},
    {code: '688599', name: '天合光能', reason: '光伏组件龙头'},
    {code: '300124', name: '汇川技术', reason: '工业自动化龙头'},
    {code: '300059', name: '东方财富', reason: '互联网券商龙头'},
    {code: '300450', name: '先导智能', reason: '锂电设备龙头'},
    {code: '300014', name: '亿纬锂能', reason: '消费+动力电池'},
    {code: '300751', name: '迈为股份', reason: 'HJT设备龙头'}
  ];

  const result = [];
  for (let s of stocks) {
    const info = await fetchStock(s.code);
    if (info) {
      info.reason = s.reason;
      result.push(info);
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: new Date().toLocaleDateString('zh-CN'),
      stocks: result.sort((a,b) => b.change - a.change).slice(0, 10)
    })
  };
};
