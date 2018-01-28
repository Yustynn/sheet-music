import pygame as pg
import time
import datetime, threading, time

pg.mixer.init(channels=2)
pg.init()
pg.mixer.set_num_channels(8)

class Piano:
    def __init__(self):
        C2 = pg.mixer.Sound("sound/piano/2/C.wav")
        Db2 = pg.mixer.Sound("sound/piano/2/Db.wav")
        D2 = pg.mixer.Sound("sound/piano/2/D.wav")
        Eb2 = pg.mixer.Sound("sound/piano/2/Eb.wav")
        E2 = pg.mixer.Sound("sound/piano/2/E.wav")
        F2 = pg.mixer.Sound("sound/piano/2/F.wav")
        Gb2 = pg.mixer.Sound("sound/piano/2/Gb.wav")
        G2 = pg.mixer.Sound("sound/piano/2/G.wav")
        A3 = pg.mixer.Sound("sound/piano/3/A.wav")
        Bb3 = pg.mixer.Sound("sound/piano/3/Bb.wav")
        B3 = pg.mixer.Sound("sound/piano/3/B.wav")
        C3 = pg.mixer.Sound("sound/piano/3/C.wav")
        Db3 = pg.mixer.Sound("sound/piano/3/Db.wav")
        D3 = pg.mixer.Sound("sound/piano/3/D.wav")
        Eb3 = pg.mixer.Sound("sound/piano/3/Eb.wav")
        E3 = pg.mixer.Sound("sound/piano/3/E.wav")
        F3 = pg.mixer.Sound("sound/piano/3/F.wav")
        Gb3 = pg.mixer.Sound("sound/piano/3/Gb.wav")
        G3 = pg.mixer.Sound("sound/piano/3/G.wav")

    def playSound(self,note,octave):
        if(note=='C'):
            if(octave==2):
                C2.play()
            if(octave==3):
                C3.play()
        if(note=='D'):
            if(octave==2):
                D2.play()
            if(octave==3):
                D3.play()
        if(note=='E'):
            if(octave==2):
                E2.play()
            if(octave==3):
                E3.play()
        if(note=='F'):
            if(octave==2):
                F2.play()
            if(octave==3):
                F3.play()
        if(note=='G'):
            if(octave==2):
                G2.play()
            if(octave==3):
                G3.play()
        if(note=='A'):
            if(octave==2):
                A2.play()
            if(octave==3):
                A3.play()
        if(note=='B'):
            if(octave==2):
                B2.play()
            if(octave==3):
                B3.play()
        if(note=='Ab'):
            if(octave==2):
                Ab2.play()
            if(octave==3):
                Ab3.play()
        if(note=='Bb'):
            if(octave==2):
                Bb2.play()
            if(octave==3):
                Bb3.play()
        if(note=='Db'):
            if(octave==2):
                Db2.play()
            if(octave==3):
                Db3.play()
        if(note=='Eb'):
            if(octave==2):
                Eb2.play()
            if(octave==3):
                Eb3.play()
        if(note=='Gb'):
            if(octave==2):
                Gb2.play()
            if(octave==3):
                Gb3.play()
