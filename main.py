from javascript import require, On, Once
from dotenv import load_dotenv
import sys, os, datetime, time
from threading import Thread

print('Starting logs')

mineflayer = require('mineflayer')
pathfinder = require('mineflayer-pathfinder')

load_dotenv()

logFile = open(file=f'logs/log_{datetime.datetime.now().strftime('%Y_%m_%d %H_%M_%S')}.txt', mode='w', encoding='utf-8')

sys.stdout = logFile
sys.stderr = logFile

RANGE_GOAL = 1
BOT_USERNAME = os.getenv('botUsername', 'PythonBot')

bot = mineflayer.createBot({
  'host': os.getenv('host', 'localhost'),
  'port': os.getenv('port', 25565),
  'username': BOT_USERNAME
})

bot.loadPlugin(pathfinder.pathfinder)
print("Started mineflayer")

targetPlayer = None

@On(bot, 'spawn')
def handle(*args):
  print("I spawned 👋")

@On(bot, 'chat')
def handleMsg(this, sender, message, *args):

  movements = pathfinder.Movements(bot)
  print("Got message", sender, message)
  if sender and (sender != BOT_USERNAME):
    if message.startswith('come with me'):
      print('started following ' + sender)
      targetPlayer = sender
    if message.startswith('stop following me'):
      if targetPlayer == sender:
        print('stopped following ' + sender)
        targetPlayer == None

@On(bot, "end")
def handle(*args):
  print("Bot ended!", args)

def polling():
  while True:
    #some logic!
    if targetPlayer != None:
      print('following ', targetPlayer)
      player = bot.players[targetPlayer]

      target = player.entity
      if target != None:
        pos = target.position
        goal = pathfinder.goals.GoalNear(pos.x, pos.y, pos.z, 5)
        if(goal != None and goal != 'underfined'):
          bot.pathfinder.setGoal(goal)
    time.sleep(0.05)

def pollingConsole():
  while True:
    print('ok')
    cmd = input().split()
    if(cmd[0] == 'flush'):
      sys.stdout.flush()
      sys.stderr.flush()
    if(cmd[0] == 'go'):
      targetPlayer = cmd[1]
    if(cmd[0] == 'stop'):
      targetPlayer = None
  
PollThread = Thread(target=polling)
PollThread.start()

PollConsole = Thread(target=pollingConsole)
PollConsole.start()
