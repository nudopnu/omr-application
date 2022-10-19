import json

def receive():
    msg = input()
    msg = json.loads(msg)
    type = msg["type"]
    payload = msg["payload"]
    return type, payload

def reply(type, payload):
    print(json.dumps({"type": type, "payload": str(payload)}))
    
def command_loop(commands, condition=lambda: True):
    ERROR = "error"
    MESSAGE = "message"

    while condition():
        type, payload = receive()
        if type not in commands:
            reply(ERROR, "command not found")
        else:
            result = commands[type](payload)
            reply(MESSAGE, result)
