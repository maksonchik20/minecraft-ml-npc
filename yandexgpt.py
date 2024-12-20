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
        "text": """Ты являешь игроком в игру майнкрафт, который должен помогать игрокам. Будь доброжелательным. Можешь использовать несколько вызовов функций"""
    }, 
    {
        "role": "user",
        "text": "Привет, приди ко мне. Защити меня от вражеских мобов"
    },
    {'role': 'assistant', 'toolCallList': {'toolCalls': [{'functionCall': {'name': 'come with me', 'arguments': {'bot_username': 'MinecraftHelperBot'}}}]}},
    {
        "role": "user",
        "text": "Предыдущая функция вызвалась, вызови следующую"
    },
    {'role': 'assistant', 'toolCallList': {'toolCalls': [{'functionCall': {'name': 'guard_user', 'arguments': {}}}]}},
    {
        "role": "user",
        "text": "Предыдущая функция вызвалась, вызови следующую"
    },
]

data['tools'] = [
    {
        'function': {
        'name': 'come with me',
        'description': 'Эта функцию запускает поведение начала хождения за пользователем',
        'parameters': {
            'type': 'object',
            'properties': {
                'bot_username': {
                    'type': 'string',
                    'description': 'Имя бота'
                    }
                },
            "required": [
                    "bot_username"
                ]
        }
        }
    },
    {
        'function': {
            'name': 'guard_user',
            'description': 'Эта функцию запускает поведение защиты игрока от вражеских мобов',
            'parameters': {
                'type': 'object',
                'properties': {}
            },
        }
    },
    {
        'function': {
            'name': 'guard_location',
            'description': 'Эта функцию запускает поведение защиты локации от вражеских мобов',
            'parameters': {
                'type': 'object',
                'properties': {}
            },
        }
    }
]

response = requests.post(url, headers={'Authorization': 'Bearer ' + token}, json = data).json()
print(response)
