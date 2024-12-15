from javascript import require, On
import datetime
import sys
mineflayer = require('mineflayer')
pathfinder = require('mineflayer-pathfinder')

print('Starting logs')

logFile = open(file=f'logs/log_{datetime.datetime.now().strftime('%Y_%m_%d %H_%M_%S')}.txt', mode='w', encoding='utf-8')

sys.stdout = logFile
sys.stderr = logFile

RANGE_GOAL = 1
BOT_USERNAME = 'python'

bot = mineflayer.createBot({
  'host': '10.82.95.41',
  'port': 25565,
  'username': BOT_USERNAME
})

bot.loadPlugin(pathfinder.pathfinder)
print("Started mineflayer")

@On(bot, 'spawn')
def handle(*args):
  print("I spawned 👋")

@On(bot, 'chat')
def handleMsg(this, sender, message, *args):
  movements = pathfinder.Movements(bot)
  print("Got message", sender, message)
  if sender and (sender != BOT_USERNAME):
    bot.chat('Hi, you said ' + message)
    if 'come' in message:
      player = bot.players[sender]
      print("Target", player)
      target = player.entity
      if not target:
        bot.chat("I don't see you !")
        return
      
      pos = target.position
      bot.pathfinder.setMovements(movements)
      bot.pathfinder.setGoal(pathfinder.goals.GoalNear(pos.x, pos.y, pos.z, RANGE_GOAL))

@On(bot, "end")
def handle(*args):
  print("Bot ended!", args)

