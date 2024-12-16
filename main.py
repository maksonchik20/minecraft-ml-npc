from javascript import require, On, Once
from datetime import datetime

mineflayer = require('mineflayer')
pathfinder = require('mineflayer-pathfinder')
mineflayerViewer = require('prismarine-viewer')



RANGE_GOAL = 2
BOT_USERNAME = 'sigma'

bot = mineflayer.createBot({
  'host': '10.82.95.41',
  'port': 25565,
  'username': BOT_USERNAME
})

bot.loadPlugin(pathfinder.pathfinder)
bot.loadPlugin(mineflayerViewer.mineflayer)
print("Started mineflayer")


# @Once(bot, 'spawn')
# def viewer(*args):
#    mineflayerViewer(bot, {"port": 25565, "firstPerson": True})

@On(bot, 'spawn')
def handle(*args):
  print("I spawned 👋")
  # print("viewer: ", mineflayerViewer.headless)
  # print(bot.mineflayerViewer)
  mineflayerViewer.mineflayer(bot, {"port": 8089, "frames": -1, "width": 512, "height": 512, "firstPerson": True})
  # mineflayerViewer({"output": '127.0.0.1:8089', "frames": -1, "width": 512, "height": 512})
  # mineflayerViewer.mineflayer({"port": 25565})
  # bot.mineflayerViewer({"port": 25565, "firstPerson": True})

# @On(bot, 'chat')
# def handleMsg(this, sender, message, *args):
#   movements = pathfinder.Movements(bot)
#   print("Got message", sender, message)
#   if sender and (sender != BOT_USERNAME):
#     bot.chat('Hi, you said ' + message)
#     if 'bye' in message:
#       bot.quit(f"{sender} told me to")
#       bot.chat("GoodBye!")
#     if message.startswith('time'):
#        bot.chat(f"Current time: " + str(datetime.today()))
#     if 'come' in message:
#       player = bot.players[sender]
#       print("Target", player)
#       print(player)
#       target = player.entity
#       if not target:
#         bot.chat("I don't see you !")
#         return
#       pos = target.position
#       bot.pathfinder.setMovements(movements)
#       bot.pathfinder.setGoal(pathfinder.goals.GoalNear(pos.x, pos.y, pos.z, RANGE_GOAL))

# @On(bot, "end")
# def handle(*args):
#   print("Bot ended!", args)
  
# @On(bot, "rain")
# def rain(this):
#     if bot.isRaining:
#         bot.chat("It stopped raining")
#     else:
#         bot.chat("It started raining")

# @On(bot, "playerJoined")
# def playerJoined(this, player):
#     print("joined", player)
#     if player["username"] != bot.username:
#         bot.chat(f"Hello, {player['username']}! Welcome to the server.")