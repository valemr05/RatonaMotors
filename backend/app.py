from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import send_from_directory

import os
import time
import json
from werkzeug.utils import secure_filename
from config import get_db_connection, close_db_connection

app = Flask(__name__)
CORS(app)  # Permite que React se conecte

# Ruta de prueba
@app.route('/')
def home():
    return jsonify({"mensaje": "API de RatonaMotors funcionando correctamente"})

# ========== CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ==========
# Carpeta donde se guardarán las imágenes
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'vehiculos')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Crear carpeta si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB máximo por archivo

def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
                    GROUP_CONCAT(
                    CONCAT('http://localhost:5000/static/vehiculos/', iv.url_imagen)
                    ORDER BY iv.es_principal DESC
                    SEPARATOR ','
                ) as imagenes
            FROM vehiculos v
            LEFT JOIN caracteristicas_vehiculo c ON v.id_vehiculo = c.id_vehiculo
            LEFT JOIN imagenes_vehiculo iv ON v.id_vehiculo = iv.id_vehiculo
            WHERE v.disponible = TRUE
            GROUP BY v.id_vehiculo
            ORDER BY v.fecha_registro DESC
        """)
        vehiculos = cursor.fetchall()
        
        # Convertir string de imágenes a array
        for vehiculo in vehiculos:
            if vehiculo['imagenes']:
                vehiculo['imagenes'] = vehiculo['imagenes'].split(',')
                vehiculo['imagen_principal'] = vehiculo['imagenes'][0] if vehiculo['imagenes'] else None
            else:
                vehiculo['imagenes'] = []
                vehiculo['imagen_principal'] = None
        
        cursor.close()
        return jsonify(vehiculos), 200
        
    except Exception as e:
        print(f"Error en get_vehiculos: {str(e)}")
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
    """Crea un nuevo vehículo con imágenes"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        # Verificar que sea multipart/form-data
        if not request.content_type or 'multipart/form-data' not in request.content_type:
            return jsonify({"error": "Content-Type debe ser multipart/form-data"}), 415
        
        # Obtener datos del formulario
        marca = request.form.get('marca')
        modelo = request.form.get('modelo')
        año = request.form.get('año')
        color = request.form.get('color')
        precio = request.form.get('precio')
        kilometraje = request.form.get('kilometraje', 0)
        estado = request.form.get('estado', 'nuevo')
        caracteristicas = request.form.get('caracteristicas')
        
        print(f"Datos recibidos: marca={marca}, modelo={modelo}, año={año}")
        print(f"Archivos recibidos: {request.files}")
        
        # Validar campos requeridos
        if not all([marca, modelo, año, color, precio]):
            return jsonify({"error": "Faltan campos requeridos"}), 400
        
        cursor = connection.cursor()
        
        # Insertar vehículo
        sql_vehiculo = """
            INSERT INTO vehiculos 
            (marca, modelo, año, color, precio, kilometraje, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql_vehiculo, (
            marca, modelo, año, color, precio, kilometraje, estado
        ))
        
        id_vehiculo = cursor.lastrowid
        print(f"Vehículo creado con ID: {id_vehiculo}")
        
        # Crear nombre de carpeta (marca-modelo limpio)
        folder_name = f"{marca.lower().replace(' ', '-')}-{modelo.lower().replace(' ', '-')}-{id_vehiculo}"
        vehicle_folder = os.path.join(app.config['UPLOAD_FOLDER'], folder_name)
        
        # Crear carpeta del vehículo si no existe
        if not os.path.exists(vehicle_folder):
            os.makedirs(vehicle_folder)
            print(f"Carpeta creada: {vehicle_folder}")
        
        # Insertar características si existen
        if caracteristicas:
            caract = json.loads(caracteristicas)
            sql_caracteristicas = """
                INSERT INTO caracteristicas_vehiculo
                (id_vehiculo, num_puertas, tipo_combustible, motor, transmision,
                 aire_acondicionado, direccion, control_traccion, version)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_caracteristicas, (
                id_vehiculo,
                caract.get('num_puertas'),
                caract.get('tipo_combustible'),
                caract.get('motor'),
                caract.get('transmision'),
                caract.get('aire_acondicionado', False),
                caract.get('direccion'),
                caract.get('control_traccion'),
                caract.get('version')
            ))
            print("Características insertadas")
        
        # Procesar imágenes
        imagenes = request.files.getlist('imagenes')
        imagen_principal_index = int(request.form.get('imagen_principal_index', 0))
        
        print(f"Número de imágenes recibidas: {len(imagenes)}")
        
        if not imagenes or len(imagenes) == 0:
            connection.rollback()
            return jsonify({"error": "Debes subir al menos una imagen"}), 400
        
        for index, imagen in enumerate(imagenes):
            if imagen and imagen.filename and allowed_file(imagen.filename):
                # Generar nombre único
                filename = secure_filename(imagen.filename)
                timestamp = int(time.time())
                unique_filename = f"{timestamp}_{index}_{filename}"
                
                # Guardar en la carpeta del vehículo
                filepath = os.path.join(vehicle_folder, unique_filename)
                
                print(f"Guardando imagen: {folder_name}/{unique_filename}")
                
                # Guardar archivo
                imagen.save(filepath)
                
                # Guardar en BD con la ruta relativa (carpeta/archivo)
                url_relativa = f"{folder_name}/{unique_filename}"
                es_principal = 1 if index == imagen_principal_index else 0
                
                sql_imagen = """
                    INSERT INTO imagenes_vehiculo 
                    (id_vehiculo, url_imagen, es_principal)
                    VALUES (%s, %s, %s)
                """
                cursor.execute(sql_imagen, (id_vehiculo, url_relativa, es_principal))
                print(f"Imagen guardada en BD: {url_relativa}, es_principal={es_principal}")
        
        connection.commit()
        cursor.close()
        
        print("✅ Vehículo creado exitosamente")
        return jsonify({
            "mensaje": "Vehículo creado exitosamente",
            "id": id_vehiculo
        }), 201
        
    except Exception as e:
        connection.rollback()
        print(f"❌ Error en crear_vehiculo: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)



@app.route('/static/vehiculos/<path:filename>')
def serve_vehiculo_image(filename):
    """Sirve las imágenes de los vehículos"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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

@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    """Obtiene todos los usuarios/empleados"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_usuario, nombre, apellido, email, rol, telefono, activo, fecha_registro
            FROM usuarios 
            ORDER BY fecha_registro DESC
        """)
        usuarios = cursor.fetchall()
        cursor.close()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

@app.route('/api/usuarios/<int:id>/estado', methods=['PATCH'])
def actualizar_estado_usuario(id):
    """Actualiza el estado activo/inactivo de un usuario"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE usuarios SET activo = %s WHERE id_usuario = %s", 
                      (data.get('activo'), id))
        connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Estado actualizado exitosamente"}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    """Elimina un usuario"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id_usuario = %s", (id,))
        connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

# ========== ENDPOINTS DE PRUEBAS DE MANEJO ==========

@app.route('/api/pruebas-manejo', methods=['GET'])
def get_pruebas_manejo():
    """Obtiene todas las pruebas de manejo"""
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                pm.id_prueba,
                pm.id_vehiculo,
                pm.id_cliente,
                COALESCE(c.nombre, pm.nombre_solicitante) AS nombre,
                COALESCE(c.apellido, pm.apellido_solicitante) AS apellido,
                COALESCE(c.documento, pm.documento_solicitante) AS documento,
                COALESCE(c.telefono, pm.telefono_solicitante) AS telefono,
                COALESCE(c.email, pm.email_solicitante) AS email,
                pm.fecha_prueba,
                pm.hora_prueba,
                pm.id_empleado_asignado,
                pm.estado,
                pm.observaciones,
                pm.fecha_solicitud,
                v.marca,
                v.modelo,
                v.año,
                CONCAT(u.nombre, ' ', u.apellido) AS empleado_asignado
            FROM pruebas_manejo pm
            JOIN vehiculos v ON pm.id_vehiculo = v.id_vehiculo
            LEFT JOIN usuarios u ON pm.id_empleado_asignado = u.id_usuario
            LEFT JOIN clientes c ON pm.id_cliente = c.id_cliente
            ORDER BY pm.fecha_prueba DESC, pm.hora_prueba DESC
        """)

        pruebas = cursor.fetchall()
        cursor.close()

        for p in pruebas:
            if isinstance(p.get("hora_prueba"), (dict,)):
                continue
            if "hora_prueba" in p and p["hora_prueba"] is not None:
                p["hora_prueba"] = str(p["hora_prueba"])

        return jsonify(pruebas), 200
    except Exception as e:
        print(f"Error en get_pruebas_manejo: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/pruebas-manejo', methods=['POST'])
def crear_prueba_manejo():
    """Crea una nueva prueba de manejo"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        sql = """
            INSERT INTO pruebas_manejo 
            (id_vehiculo, id_cliente, nombre_solicitante, apellido_solicitante, 
             documento_solicitante, telefono_solicitante, email_solicitante, 
             fecha_prueba, hora_prueba, observaciones, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pendiente')
        """
        valores = (
            data.get('id_vehiculo'),
            data.get('id_cliente'),
            data.get('nombre'),
            data.get('apellido'),
            data.get('documento'),
            data.get('telefono'),
            data.get('email'),
            data.get('fecha_prueba'),
            data.get('hora_prueba'),
            data.get('observaciones')
        )
        cursor.execute(sql, valores)
        connection.commit()
        id_prueba = cursor.lastrowid
        cursor.close()
        
        return jsonify({
            "mensaje": "Prueba de manejo agendada exitosamente",
            "id": id_prueba
        }), 201
    except Exception as e:
        connection.rollback()
        print(f"Error en crear_prueba_manejo: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)


@app.route('/api/pruebas-manejo/<int:id>/estado', methods=['PATCH'])
def actualizar_estado_prueba(id):
    """Actualiza el estado de una prueba de manejo"""
    data = request.json
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    
    try:
        cursor = connection.cursor()
        
        if data.get('id_empleado_asignado'):
            cursor.execute("""
                UPDATE pruebas_manejo 
                SET estado = %s, id_empleado_asignado = %s 
                WHERE id_prueba = %s
            """, (data.get('estado'), data.get('id_empleado_asignado'), id))
        else:
            cursor.execute("""
                UPDATE pruebas_manejo 
                SET estado = %s 
                WHERE id_prueba = %s
            """, (data.get('estado'), id))
        
        connection.commit()
        cursor.close()
        
        return jsonify({
            "mensaje": "Estado actualizado exitosamente",
            "estado": data.get('estado')
        }), 200
    except Exception as e:
        connection.rollback()
        print(f"Error en actualizar_estado_prueba: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection)

         
if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)