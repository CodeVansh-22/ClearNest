from flask_pymongo import PyMongo
from pymongo.errors import ServerSelectionTimeoutError

mongo = PyMongo()

def init_mongodb(app):
    try:
        mongo.init_app(app)
        # Verify connection
        mongo.db.command('ping')
        app.config["MONGODB_AVAILABLE"] = True
        print("MongoDB Atlas connected successfully!")
    except Exception as e:
        app.config["MONGODB_AVAILABLE"] = False
        app.config["MONGODB_ERROR"] = str(e)
        print(f"CRITICAL: MongoDB connection failed: {e}")
    return mongo
