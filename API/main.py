import pandas as pd
from flask import Flask, request, jsonify
import os
import time

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello, World!"


URL = r"https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv"
ROOM_NAMES = ["P1.1", "P2.2", "Aula", "Sborovna", "USV", "P2.3"]
ROOMS = len(ROOM_NAMES)
DAY_LENGTHS = [5, 6, 3]


class Harmonogram:
    def __init__(self):
        self.fetch_data()
        self.last_updated = time.time()

    def fetch_data(self):
        print("fetching table")
        df = pd.read_csv(URL)
        self.names = df.iloc[:, 4].astype(str).tolist()
        self.names = [name if ((name != "-") and (name != "nan")) else "" for name in self.names]
        self.times = df.iloc[:, 5].astype(str).tolist()
        self.rooms = df.iloc[:, 6].astype(str).tolist()
        self.medailons = df.iloc[:, 7].astype(str).tolist()
        self.annotations = df.iloc[:, 8].astype(str).tolist()
        self.titles = df.iloc[:, 9].astype(str).tolist()
        self.titles = [title if title != "nan" else "" for title in self.titles]
    
    def update_data(self, force=False):
        if force or (time.time() - self.last_updated > 30*60):
            self.fetch_data()
            self.last_updated = time.time()

    def create_table(self):
        day_offset = 0
        days = []
        for day in range(3):
            day_table = {}
            for room in range(ROOMS):
                table_row = []
                for time in range(DAY_LENGTHS[day]):
                    index = day_offset + time*ROOMS + room
                    table_row.append(
                        {"name": self.names[index], "title": self.titles[index], "id": index})
                day_table[ROOM_NAMES[room]] = table_row
            days.append(day_table)
            day_offset += DAY_LENGTHS[day] * ROOMS
        return days

    def get_harmonogram(self):
        self.update_data()
        return self.create_table()

    def get_lecture_info(self, index):
        self.update_data()
        return {"name": self.names[index], "title": self.titles[index], "time": self.times[index], "room": self.rooms[index], "medailon": self.medailons[index], "annotation": self.annotations[index]}


worker = Harmonogram()


@app.route('/harmonogram')
def harmonogram():
    return _corsify_actual_response(jsonify(worker.get_harmonogram()))

@app.route('/force_fetch')
def force_fetch():
    worker.update_data(True)
    return _corsify_actual_response(jsonify("Data updated"))


@app.route('/lecture_info')
def lecture_info():
    index = request.args.get('id')

    return _corsify_actual_response(jsonify(worker.get_lecture_info(int(index))))


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
