import json

while True:
    msg = input()
    print(msg)
    
data = {"hello":["woorld", "02", 2]}
print('{"hello":"woorld"}')
print(json.dumps(data))
