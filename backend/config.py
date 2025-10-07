import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """Crea y retorna una conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='ratonamotors',
            user='root',
            password=''  # no hay clave hasta el momento
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

def close_db_connection(connection):
    """Cierra la conexión a la base de datos"""
    if connection and connection.is_connected():
        connection.close()