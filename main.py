import os
from src.scraper import ZooScraper
from src.chatbase_client import ChatbaseClient

def main():
    print("Starting Zoo News Sync...")
    
    # Configuration
    # We prioritize Environment variables, but fallback to hardcoded for this specific run if needed (though not recommended for prod)
    # The user provided these in chat, so we can set them in the shell or .env
    # For now, we assume they are passed via env vars when running the command.
    CHATBASE_API_KEY = os.getenv("CHATBASE_API_KEY")
    CHATBASE_CHATBOT_ID = os.getenv("CHATBASE_CHATBOT_ID")
    
    if not CHATBASE_API_KEY or not CHATBASE_CHATBOT_ID:
        print("Error: Missing credentials. Please set CHATBASE_API_KEY and CHATBASE_CHATBOT_ID.")
        return
    

    # 1. Scrape News (Dynamic)
    scraper = ZooScraper()
    news_items = scraper.fetch_recent_news(limit_per_source=5)
    print(f"Found {len(news_items)} news articles.")
    
    # 2. Scrape Static Pages (Monitoring)
    static_pages = scraper.fetch_static_pages()
    print(f"Fetched {len(static_pages)} static pages.")

    # 3. File Persistence (For Git Scraping)
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    # Save News
    news_text = "Latest Zoo News:\n========================\n\n"
    for item in news_items:
        news_text += f"【{item['category']}】 {item['title']}\n"
        if item['date']:
            news_text += f"Date: {item['date']}\n"
        news_text += f"Link: {item['url']}\n"
        news_text += f"Summary: {item['content']}\n"
        news_text += "-" * 30 + "\n\n"
        
    with open("data/news_updates.txt", "w", encoding="utf-8") as f:
        f.write(news_text)

    # Save Static Pages
    for name, data in static_pages.items():
        filename = f"data/{name.replace(' ', '_').lower()}.txt"
        content = f"Page: {name}\nURL: {data['url']}\n\n{data['content']}"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

    # 4. Combine All Data for Chatbase
    combined_text = news_text + "\n\n" + "="*50 + "\n\n"
    for name, data in static_pages.items():
        combined_text += f"--- {name} ---\nSource: {data['url']}\n\n{data['content']}\n\n"

    print(f"Prepared total payload size: {len(combined_text)} chars")

    # 5. Sync to Chatbase
    if CHATBASE_API_KEY and CHATBASE_CHATBOT_ID:
        client = ChatbaseClient(CHATBASE_API_KEY)
        success = client.update_source_text(CHATBASE_CHATBOT_ID, combined_text)
        if success:
            print("Sync Process Completed Successfully.")
        else:
            print("Sync Process Failed.")
    else:
        print("Skipping Chatbase sync (No Credentials).")

if __name__ == "__main__":
    main()
