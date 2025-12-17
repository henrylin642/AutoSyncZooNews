
import os
import requests
import json

class ChatbaseClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://www.chatbase.co/api/v1"

    def get_chatbot_name(self, chatbot_id):
        """
        Fetches the chatbot name to avoid overwriting it during update.
        Uses GET /api/v1/get-chatbots
        """
        url = f"{self.base_url}/get-chatbots"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, timeout=15)
            if response.status_code == 200:
                data = response.json()
                # data should be something like {"chatbots": [...]} or just [...]
                # Let's inspect, usually it's list or dict with key 'chatbots'
                chatbots = data.get('chatbots', []) if isinstance(data, dict) else data
                
                for bot in chatbots:
                    if bot.get('id') == chatbot_id:
                        return bot.get('name')
            return "Zoo News Sync Bot" # Fallback
        except Exception as e:
            print(f"Error fetching bot name: {e}")
            return "Zoo News Sync Bot"

    def update_source_text(self, chatbot_id, text, source_name="News Update"):
        """
        Updates the chatbot source with new text.
        Payload:
        {
          "chatbotId": "...",
          "chatbotName": "...",
          "sourceText": "..."
        }
        """
        url = f"{self.base_url}/update-chatbot-data"
        
        # 1. Get current name to prevent rename side-effect
        current_name = self.get_chatbot_name(chatbot_id)
        print(f"Preserving Chatbot Name: {current_name}")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "chatbotId": chatbot_id,
            "chatbotName": current_name,
            "sourceText": text
        }
        
        try:
            print(f"Sending update to Chatbase for Chatbot ID: {chatbot_id}")
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                print("Chatbase update successful!")
                return True
            else:
                print(f"Error updating Chatbase: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Exception during Chatbase update: {e}")
            return False
