import sounddevice as sd
import vosk
import queue
import json
import sys
import websockets
import asyncio

model = vosk.Model("vosk-model-small-en-us")
q = queue.Queue()

async def send_transcription(websocket, path):
    def callback(indata, frames, time, status):
        q.put(bytes(indata))

    with sd.RawInputStream(samplerate=16000, blocksize=8000, dtype='int16',
                           channels=1, callback=callback):
        rec = vosk.KaldiRecognizer(model, 16000)
        print("Listening...")
        while True:
            data = q.get()
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                await websocket.send(json.dumps({"type": "final", "text": result['text']}))
            else:
                partial = json.loads(rec.PartialResult())
                await websocket.send(json.dumps({"type": "partial", "text": partial['partial']}))

async def main():
    async with websockets.serve(send_transcription, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
