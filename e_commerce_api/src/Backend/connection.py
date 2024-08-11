#pip install mysql-connector-python

import mysql.connector
from mysql.connector import Error

def connect_db():
    db_name = "e_commerce_db"
    user = "root"
    password = "Mysql24$"
    host = "localhost"
    
    try:
        conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=db_name
        )
        
        if conn.is_connected():
            print("Connected to the database successfully")
            return conn
        
    except Error as e:
        print(f'Error: {e}')  
        return None

connect_db() 