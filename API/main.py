import requests
import csv
import pandas as pd

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, World!"

URL = r"https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv"
"""
response = requests.get(r"https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv")
response_csv = response.content
print(response_csv)
"""
df = pd.read_csv(URL)
speakers = df.iloc[:, 0].astype(str).tolist()

day_lengths = [4, 4, 2]
ROOMS = 6

days = []
index = 0
for i in day_lengths:
    day = []
    for j in range(i):
        room = ""
        for k in range(ROOMS):
            room += "<td>" + speakers[index] + "</td>"
            index += 1
        day.append(room)
    days.append(day)

print(days)
