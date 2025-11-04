from flask import Flask, jsonify
import psycopg2
import os

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    conn = psycopg2.connect(
        host="db",
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )
    cur = conn.cursor()
    cur.execute("SELECT 'Hola desde PostgreSQL!'")
    result = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(message=result[0])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)