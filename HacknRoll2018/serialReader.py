import serial
from threading import Thread
from aiohttp import web
import socketio
from musicPlayer import Piano

# /guitar/0100/s1f1/s2f0/s3f2/s4f1
# /piano/a/b/c/d/e/f/g/
# /recorder/bottom/1/2/3/4/5/6/7

piano = Piano()

sio = socketio.AsyncServer(ping_timeout=1000,ping_interval=1000)
app = web.Application()
sio.attach(app)

def unblock(fn):
    t = Thread(target=fn)
    t.daemon = True
    t.start()

@sio.on('connect')
def connect(sid, environ):
    print("connect ", sid)

@sio.on('oi')
async def oi(sid, msg):
    print('oi')
    ser = serial.Serial('COM9', 9600)
    while True:
        state = ser.readline().decode("utf-8")
        await sio.emit('data',state)
        information = state.strip('\n').split('/')
        print(information)
        for param in information:
            print(param)
            # piano.playSound(substring,2)

@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == "__main__":

    web.run_app(app)
    print('wat')
