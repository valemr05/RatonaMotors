from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_db_connection, close_db_connection

app = Flask(__name__)
CORS(app)  # Permite que React se conecte

# Ruta de prueba
@app.route('/')
def home():
    return jsonify({"mensaje": "API de RatonaMotors funcionando correctamente"})

# ========== ENDPOINTS DE VEHÍCULOS ==========

@app.route('/api/vehiculos', methods=['GET'])
def get_vehiculos():
    """Obtiene todos los vehículos"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT v.*, c.num_puertas, c.tipo_combustible, c.motor, 
                   c.transmision, c.aire_acondicionado, c.direccion, 
                   c.control_traccion, c.version
            FROM vehiculos v
            LEFT JOIN caracteristicas_vehiculo c ON v.id_vehiculo = c.id_vehiculo
            WHERE v.disponible = TRUE
        """)
        vehiculos = cursor.fetchall()
        cursor.close()
        return jsonify(vehiculos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/vehiculos/<int:id>', methods=['GET'])
def get_vehiculo(id):
    """Obtiene un vehículo específico por ID"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT v.*, c.num_puertas, c.tipo_combustible, c.motor, 
                   c.transmision, c.aire_acondicionado, c.direccion, 
                   c.control_traccion, c.version
            FROM vehiculos v
            LEFT JOIN caracteristicas_vehiculo c ON v.id_vehiculo = c.id_vehiculo
            WHERE v.id_vehiculo = %s
        """, (id,))
        vehiculo = cursor.fetchone()
        cursor.close()
        
        if vehiculo:
            return jsonify(vehiculo), 200
        else:
            return jsonify({"error": "Vehículo no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/vehiculos', methods=['POST'])
def crear_vehiculo():
    """Crea un nuevo vehículo"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Insertar vehículo
        sql_vehiculo = """
            INSERT INTO vehiculos (marca, modelo, año, color, precio, kilometraje, estado, imagen_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores_vehiculo = (
            data.get('marca'),
            data.get('modelo'),
            data.get('año'),
            data.get('color'),
            data.get('precio'),
            data.get('kilometraje', 0),
            data.get('estado', 'nuevo'),
            data.get('imagen_url')
        )
        cursor.execute(sql_vehiculo, valores_vehiculo)
        id_vehiculo = cursor.lastrowid
        
        # Insertar características si existen
        if 'caracteristicas' in data:
            caract = data['caracteristicas']
            sql_caracteristicas = """
                INSERT INTO caracteristicas_vehiculo 
                (id_vehiculo, num_puertas, tipo_combustible, motor, transmision, 
                 aire_acondicionado, direccion, control_traccion, version)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            valores_caracteristicas = (
                id_vehiculo,
                caract.get('num_puertas'),
                caract.get('tipo_combustible'),
                caract.get('motor'),
                caract.get('transmision'),
                caract.get('aire_acondicionado', False),
                caract.get('direccion'),
                caract.get('control_traccion'),
                caract.get('version')
            )
            cursor.execute(sql_caracteristicas, valores_caracteristicas)
        
        connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Vehículo creado exitosamente", "id": id_vehiculo}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

# ========== ENDPOINTS DE CLIENTES ==========

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    """Obtiene todos los clientes"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes")
        clientes = cursor.fetchall()
        cursor.close()
        return jsonify(clientes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/clientes', methods=['POST'])
def crear_cliente():
    """Crea un nuevo cliente"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        sql = """
            INSERT INTO clientes (nombre, apellido, documento, telefono, email, direccion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        valores = (
            data.get('nombre'),
            data.get('apellido'),
            data.get('documento'),
            data.get('telefono'),
            data.get('email'),
            data.get('direccion')
        )
        cursor.execute(sql, valores)
        connection.commit()
        id_cliente = cursor.lastrowid
        cursor.close()
        return jsonify({"mensaje": "Cliente creado exitosamente", "id": id_cliente}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

# ========== ENDPOINTS DE VENTAS ==========

@app.route('/api/ventas', methods=['GET'])
def get_ventas():
    """Obtiene todas las ventas"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT v.*, 
                   CONCAT(c.nombre, ' ', c.apellido) as cliente,
                   CONCAT(veh.marca, ' ', veh.modelo) as vehiculo,
                   CONCAT(u.nombre, ' ', u.apellido) as vendedor
            FROM ventas v
            JOIN clientes c ON v.id_cliente = c.id_cliente
            JOIN vehiculos veh ON v.id_vehiculo = veh.id_vehiculo
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            ORDER BY v.fecha_venta DESC
        """)
        ventas = cursor.fetchall()
        cursor.close()
        return jsonify(ventas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/ventas', methods=['POST'])
def crear_venta():
    """Registra una nueva venta"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Insertar venta
        sql_venta = """
            INSERT INTO ventas (id_vehiculo, id_cliente, id_usuario, precio_venta, forma_pago, observaciones)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        valores = (
            data.get('id_vehiculo'),
            data.get('id_cliente'),
            data.get('id_usuario'),
            data.get('precio_venta'),
            data.get('forma_pago'),
            data.get('observaciones')
        )
        cursor.execute(sql_venta, valores)
        
        # Marcar vehículo como no disponible
        cursor.execute("UPDATE vehiculos SET disponible = FALSE WHERE id_vehiculo = %s", 
                      (data.get('id_vehiculo'),))
        
        connection.commit()
        id_venta = cursor.lastrowid
        cursor.close()
        return jsonify({"mensaje": "Venta registrada exitosamente", "id": id_venta}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

# ========== ENDPOINTS DE USUARIOS ==========

@app.route('/api/login', methods=['POST'])
def login():
    """Login de usuarios (admin/empleado)"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_usuario, nombre, apellido, email, rol, activo 
            FROM usuarios 
            WHERE email = %s AND password = %s AND activo = TRUE
        """, (data.get('email'), data.get('password')))
        usuario = cursor.fetchone()
        cursor.close()
        
        if usuario:
            return jsonify({"mensaje": "Login exitoso", "usuario": usuario}), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

if __name__ == '__main__':
    app.run(debug=True, port=5000)