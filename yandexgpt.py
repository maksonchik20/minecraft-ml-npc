import requests
import os
from dotenv import load_dotenv

url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

load_dotenv()
data = {}

token = os.getenv('GPT_TOKEN')

data['modelUri'] = 'gpt://b1glpqm6du4km50rq59p/yandexgpt/latest'

data['completionOptions'] = {'stream': False,
                             'temperature': 0.3,
                             'maxTokens': 1000}

data['messages'] = [
    {
        "role": "system",
        "text": """Ты являешь игроком в игру майнкрафт, который должен помогать игрокам. Будь доброжелательным"""
    }, 
    {
        "role": "user",
        "text": "Какая погода в Моске?"
    }
]

data['tools'] = []

data['tools'].append({
        'function': {
            'name': 'get_weather',
            'description': 'с помощью данной функции можно узнать погоду в городе',
            'parameters': {
                'type': 'object',
                'properties': {
                    'location': {
                        'type': 'string',
                        'description': 'Местоположение, например, название города'
                    }
                }
            }
        }
    }
)

response = requests.post(url, headers={'Authorization': 'Bearer ' + token}, json = data).json()
print(response)
