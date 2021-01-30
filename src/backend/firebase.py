
import firebase_admin
from firebase_admin import credentials, db

import asyncio

from pathlib import Path

root = Path(__file__).parent.parent.parent


def init():
    cred = credentials.Certificate(str(root / "cityhack21-firebaseAdmin.json"))
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://cityhack21-6404b-default-rtdb.firebaseio.com/'
    })


def get_data(key):
    return db.reference(key).get()


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)


def set_data(key, value):
    loop.run_in_executor(None, lambda: db.reference(key).update(value))


def get_and_set_data(get_keys, set_key, evaluator):
    loop.run_in_executor(
        None,
        lambda:
            db.reference(set_key).update(evaluator(*[get_data(get_key) for get_key in get_keys]))
    )

init()
