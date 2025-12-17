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
    
    # 1. Scrape News
    scraper = ZooScraper()
    # Fetch all data (limit=5 from each source means up to 15 articles)
    news_items = scraper.fetch_recent_news(limit_per_source=5)
    print(f"Found {len(news_items)} total articles.")
    
    if not news_items:
        print("No news found to sync.")
        return

    # 2. Prepare Data for Chatbase
    # The API replaces sourceText, so we must be careful.
    # We want to provide a comprehensive update.
    combined_text = "Today's Zoo News Update:\n========================\n\n"
    
    # Sort roughly by date if present
    # news_items.sort(key=lambda x: x['date'], reverse=True) 

    for item in news_items:
        combined_text += f"【{item['category']}】 {item['title']}\n"
        if item['date']:
            combined_text += f"Date: {item['date']}\n"
        combined_text += f"Link: {item['url']}\n"
        combined_text += f"Summary: {item['content']}\n"
        combined_text += "-" * 30 + "\n\n"
        
    print(f"Prepared payload size: {len(combined_text)} chars")

    # 3. Sync
    client = ChatbaseClient(CHATBASE_API_KEY)
    success = client.update_source_text(CHATBASE_CHATBOT_ID, combined_text)
    
    if success:
        print("Sync Process Completed Successfully.")
    else:
        print("Sync Process Failed.")

if __name__ == "__main__":
    main()
