import requests
from datetime import datetime
from bs4 import BeautifulSoup

class ZooScraper:
    # Key = Category Name, Value = API URL
    SOURCES_NEWS = {
        "Zone Updates": "https://www.zoo.gov.taipei/OpenData.aspx?SN=77C6F77920C917B2",
        "Education Activities": "https://www.zoo.gov.taipei/OpenData.aspx?SN=D2A75D913CDBB2CE",
        "Press Releases": "https://www.zoo.gov.taipei/OpenData.aspx?SN=022A4E6F1C7F323A"
    }

    # Static pages monitoring
    SOURCES_STATIC = {
        "Opening Hours": "https://www.zoo.gov.taipei/cp.aspx?n=7D54CBE2525F75B8",
        "Ticket Prices": "https://www.zoo.gov.taipei/cp.aspx?n=763493FD7ECCAA11"
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

        for category, url in self.SOURCES_NEWS.items():
            try:
                print(f"Fetching {category} (JSON)...")
                response = requests.get(url, headers=self.HEADERS, timeout=15)
                # Check for BOM
                response.encoding = 'utf-8-sig' 
                
                data = response.json()
                
                if not isinstance(data, list):
                    print(f"Warning: Unexpected JSON format for {category}")
                    continue

                count = 0
                for item in data:
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

    def fetch_static_pages(self):
        """
        Fetches content from static HTML pages.
        Returns a dictionary: { 'Page Name': 'Content Text' }
        """
        results = {}
        for name, url in self.SOURCES_STATIC.items():
            try:
                print(f"Fetching {name} (HTML)...")
                response = requests.get(url, headers=self.HEADERS, timeout=15)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Attempt to find the main content div
                # Common classes in gov.taipei: 'text', 'cp', 'main-content'
                # Based on observation, look for a div that contains the headers
                content_div = soup.find('div', class_='text')
                if not content_div:
                     content_div = soup.find('div', class_='cp')
                
                if content_div:
                    # Cleanup: remove script and style tags
                    for script in content_div(["script", "style"]):
                        script.decompose()
                    text = content_div.get_text(separator='\n', strip=True)
                else:
                    # Fallback
                    text = soup.get_text(separator='\n', strip=True)
                    # Rough truncation for fallback
                    text = text[:2000]

                results[name] = {
                    "url": url,
                    "content": text
                }
            except Exception as e:
                print(f"Error fetching static page {name}: {e}")
        return results

if __name__ == "__main__":
    scraper = ZooScraper()
    news = scraper.fetch_recent_news()
    for item in news:
        print(f"[{item['category']}] {item['title']} ({item['date']})")
        print(f"Link: {item['url']}")
        print(f"Content: {item['content'][:100]}")
        print("-" * 20)
