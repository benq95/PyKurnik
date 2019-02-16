import sqlite3
from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, abort
from flask import g

app = Flask(__name__)
api = Api(app)

dbConfig = "dbname=postgres user=postgres password=admin host=localhost port=5433"


DATABASE = '/path/to/database.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


class Clients(Resource):
    def get(self):
        connection = psycopg2.connect(dbConfig)
        cur = connection.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT active, email, first_name, last_name, login, password, role FROM client')
        query = cur.fetchall()
        cur.close()
        connection.close()
        return query


class Client(Resource):
    def get(self, client_id):
        connection = psycopg2.connect(dbConfig)
        cur = connection.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT active, email, first_name, last_name, login, password, role FROM client WHERE id=%d' % int(
            client_id))
        query = cur.fetchall()
        cur.close()
        connection.close()
        return query


class PostClient(Resource):
    def post(self):
        json_data = request.get_json(force=False)
        email = json_data['email']
        first_name = json_data['first_name']
        last_name = json_data['last_name']
        login = json_data['login']
        password = json_data['password']
        role = json_data['role']

        connection = psycopg2.connect(dbConfig)
        cur = connection.cursor()
        cur.execute('INSERT INTO client VALUES (True, %s, %s, %s, %s, %s, %s)',
                    (email, first_name, last_name, login, password, role))
        connection.commit()
        cur.close()
        connection.close()
        return {}, 201


api.add_resource(PostClient, '/client')
api.add_resource(Clients, '/client')
api.add_resource(Client, '/client/<client_id>')

if __name__ == "__main__":
    app.run(debug=True)