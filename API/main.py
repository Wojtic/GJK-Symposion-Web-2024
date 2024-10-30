import pandas as pd

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, World!"

URL = r"https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv"

#response = requests.get(r"https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv")
#response_csv = response.content
#print(response_csv)
df = pd.read_csv(URL)
speakers = df.iloc[:, 0].astype(str).tolist()

day_lengths = [4, 4, 2]
ROOMS = 6
def fetch_data():
    days = []
    index = 0
    for i in day_lengths:
        day = []
        for j in range(i):
            room = []
            for k in range(ROOMS):
                room.append(speakers[index])
                # Ehm, use splice
                index += 1
            day.append(room)
        days.append(day)
    return days

@app.route('/harmonogram')
def harmonogram():
    days = fetch_data()
    # if key doesn't exist, returns None
    #language = request.args.get('language')

    # if key doesn't exist, returns a 400, bad request error
    #framework = request.args['framework']

    # if key doesn't exist, returns None
    #website = request.args.get('website')
    return days


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))