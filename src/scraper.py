import requests
from datetime import datetime

class ZooScraper:
    # Key = Category Name, Value = API URL
    SOURCES = {
        "Zone Updates": "https://www.zoo.gov.taipei/OpenData.aspx?SN=77C6F77920C917B2",
        "Education Activities": "https://www.zoo.gov.taipei/OpenData.aspx?SN=D2A75D913CDBB2CE",
        "Press Releases": "https://www.zoo.gov.taipei/OpenData.aspx?SN=022A4E6F1C7F323A"
    }

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    def fetch_recent_news(self, limit_per_source=3):
        """
        Fetches news from all configured JSON sources.
        Returns a list of dictionaries with unified keys: title, url, content, date, source.
        """
        all_news = []

        for category, url in self.SOURCES.items():
            try:
                print(f"Fetching {category}...")
                response = requests.get(url, headers=self.HEADERS, timeout=15)
                # The API returns a list of objects directly, or sometimes wrapped.
                # Based on the curl output: [ {"DataSN":...}, ... ]
                
                # Check for BOM (Byte Order Mark) which is common in Microsoft generated JSON
                response.encoding = 'utf-8-sig' 
                
                data = response.json()
                
                # If data is not a list, it might be an error or unexpected format
                if not isinstance(data, list):
                    print(f"Warning: Unexpected JSON format for {category}")
                    continue

                # Sort by date if possible, but they usually come sorted.
                # '日期時間' format: "2025-11-16T10:34:00"
                # We can try to sort them just in case.
                # data.sort(key=lambda x: x.get('日期時間', ''), reverse=True)

                count = 0
                for item in data:
                    # Map fields
                    # Validated keys from previous curl: 'title', '內容', 'Source' (this is the URL link)
                    title = item.get('title', '')
                    content = item.get('內容', '')
                    item_url = item.get('Source', '')
                    date_str = item.get('日期時間', '')

                    if not title:
                        continue
                        
                    # Basic cleaning
                    if len(content) > 500:
                        content = content[:500] + "..."

                    news_entry = {
                        'title': title,
                        'url': item_url,
                        'content': content,
                        'date': date_str,
                        'category': category
                    }
                    
                    all_news.append(news_entry)
                    count += 1
                    if count >= limit_per_source:
                        break
                        
            except Exception as e:
                print(f"Error fetching {category}: {e}")

        return all_news

if __name__ == "__main__":
    scraper = ZooScraper()
    news = scraper.fetch_recent_news()
    for item in news:
        print(f"[{item['category']}] {item['title']} ({item['date']})")
        print(f"Link: {item['url']}")
        print(f"Content: {item['content'][:100]}")
        print("-" * 20)
