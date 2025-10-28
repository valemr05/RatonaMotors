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
    """Obtiene todos los vehículos con su imagen principal"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                v.*, 
                c.num_puertas, 
                c.tipo_combustible, 
                c.motor, 
                c.transmision, 
                c.aire_acondicionado, 
                c.direccion, 
                c.control_traccion, 
                c.version,
                COALESCE(img.url_imagen, v.imagen_url) as imagen_principal
            FROM vehiculos v
            LEFT JOIN caracteristicas_vehiculo c ON v.id_vehiculo = c.id_vehiculo
            LEFT JOIN imagenes_vehiculo img 
                ON v.id_vehiculo = img.id_vehiculo 
                AND img.es_principal = TRUE
            WHERE v.disponible = TRUE
            ORDER BY v.fecha_registro DESC
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

# ========== ENDPOINTS DE IMÁGENES DE VEHÍCULOS ==========

@app.route('/api/vehiculos/<int:id>/imagenes', methods=['GET'])
def get_imagenes_vehiculo(id):
    """Obtiene todas las imágenes de un vehículo"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM imagenes_vehiculo 
            WHERE id_vehiculo = %s 
            ORDER BY es_principal DESC, orden ASC
        """, (id,))
        imagenes = cursor.fetchall()
        cursor.close()
        return jsonify(imagenes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/vehiculos/<int:id>/imagenes', methods=['POST'])
def agregar_imagen_vehiculo(id):
    """Agrega una nueva imagen a un vehículo"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        sql = """
            INSERT INTO imagenes_vehiculo (id_vehiculo, url_imagen, orden, es_principal)
            VALUES (%s, %s, %s, %s)
        """
        valores = (
            id,
            data.get('url_imagen'),
            data.get('orden', 0),
            data.get('es_principal', False)
        )
        cursor.execute(sql, valores)
        connection.commit()
        id_imagen = cursor.lastrowid
        cursor.close()
        return jsonify({"mensaje": "Imagen agregada exitosamente", "id": id_imagen}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/imagenes/<int:id>', methods=['DELETE'])
def eliminar_imagen(id):
    """Elimina una imagen"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM imagenes_vehiculo WHERE id_imagen = %s", (id,))
        connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Imagen eliminada exitosamente"}), 200
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


# ========== ENDPOINTS DEL DASHBOARD ==========

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Obtiene las estadísticas del dashboard"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Contar vehículos en inventario
        cursor.execute("SELECT COUNT(*) as total FROM vehiculos WHERE disponible = TRUE")
        vehiculos_count = cursor.fetchone()['total']
        
        # Contar clientes activos
        cursor.execute("SELECT COUNT(*) as total FROM clientes")
        clientes_count = cursor.fetchone()['total']
        
        # Contar ventas del mes actual
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM ventas 
            WHERE MONTH(fecha_venta) = MONTH(CURRENT_DATE()) 
            AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())
        """)
        ventas_mes = cursor.fetchone()['total']
        
        # Contar nuevos clientes de la semana
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM clientes 
            WHERE fecha_registro >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
        """)
        prospectos = cursor.fetchone()['total']
        
        cursor.close()
        
        stats = [
            {
                "title": "Vehículos en Inventario",
                "value": str(vehiculos_count),
                "change": "+2% desde ayer",
                "positive": True
            },
            {
                "title": "Clientes Activos",
                "value": str(clientes_count),
                "change": "+5% este mes",
                "positive": True
            },
            {
                "title": "Ventas este Mes",
                "value": str(ventas_mes),
                "change": "+1.5% vs mes anterior",
                "positive": True
            },
            {
                "title": "Nuevos Prospectos",
                "value": str(prospectos),
                "change": "-3% esta semana",
                "positive": False
            }
        ]
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/dashboard/activities', methods=['GET'])
def get_dashboard_activities():
    """Obtiene la actividad reciente del dashboard"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                'Venta' as tipo,
                CONCAT('Venta completada: ', veh.marca, ' ', veh.modelo, ' ', veh.año, ' a ', c.nombre, ' ', c.apellido) as descripcion,
                CASE 
                    WHEN TIMESTAMPDIFF(HOUR, v.fecha_venta, NOW()) < 24 THEN CONCAT('Hace ', TIMESTAMPDIFF(HOUR, v.fecha_venta, NOW()), ' horas')
                    ELSE CONCAT('Hace ', TIMESTAMPDIFF(DAY, v.fecha_venta, NOW()), ' días')
                END as fecha,
                'Completado' as estado,
                'green' as estadoColor
            FROM ventas v
            JOIN vehiculos veh ON v.id_vehiculo = veh.id_vehiculo
            JOIN clientes c ON v.id_cliente = c.id_cliente
            ORDER BY v.fecha_venta DESC
            LIMIT 5
        """)
        activities = cursor.fetchall()
        cursor.close()
        
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    """Crea un nuevo usuario/empleado"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        sql = """
            INSERT INTO usuarios (nombre, apellido, email, password, rol, telefono, activo)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            data.get('nombre'),
            data.get('apellido'),
            data.get('email'),
            data.get('password'),  # En producción deberías hashear la contraseña
            data.get('rol', 'empleado'),
            data.get('telefono'),
            data.get('activo', True)
        )
        cursor.execute(sql, valores)
        connection.commit()
        id_usuario = cursor.lastrowid
        cursor.close()
        return jsonify({"mensaje": "Usuario creado exitosamente", "id": id_usuario}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

if __name__ == '__main__':
    app.run(debug=True, port=5000)