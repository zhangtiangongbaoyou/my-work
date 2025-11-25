import requests
from datetime import datetime
import os

# Server酱的 SendKey（待会填）
SCTKEY = os.getenv("SCTKEY")

def get_news():
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    news = []

    # 东方财富实时新闻（最快最全）
    url = "https://np-api.eastmoney.com/api/v1/news/get?page_index=1&page_size=30"
    try:
        r = requests.get(url, headers=headers, timeout=10)
        data = r.json().get("data", {}).get("list", [])
        for x in data[:25]:
            news.append(f"【东财 {x['showTime'][:10]}】[{x['title']}]({x['url']})")
    except:
        pass

    return news

def send_to_wechat():
    if not SCTKEY:
        print("未配置 SCTKEY")
        return

    news_list = get_news()
    if not news_list:
        content = "今日暂无更新"
    else:
        content = "\n\n".join(news_list[:25])

    title = f"{datetime.now().strftime('%Y年%m月%d日')} 专属股票早报（{len(news_list)}条）"
    url = f"https://sctapi.ftqq.com/{SCTKEY}.send"
    data = {"title": title, "desp": content}
    
    try:
        requests.post(url, data=data, timeout=10)
        print("推送成功")
    except:
        print("推送失败")

if __name__ == "__main__":
    send_to_wechat()
