import os
import shutil

# Configuración - ACTUALIZADO CON TUS RUTAS
PROYECTO_FLASK = r'C:\Users\valer\Downloads\RatonaMotors\backend'  # ← Ruta de tu backend
ORIGEN_IMAGENES = r'C:\Users\valer\Downloads\RatonaMotors\backend\static\vehiculos'  # ← Origen de tus imágenes

# Crear carpeta static si no existe
static_path = os.path.join(PROYECTO_FLASK, 'static')
os.makedirs(static_path, exist_ok=True)
print(f"✓ Carpeta 'static' creada/verificada en: {static_path}")

# Crear carpeta vehiculos dentro de static
vehiculos_path = os.path.join(static_path, 'vehiculos')
os.makedirs(vehiculos_path, exist_ok=True)
print(f"✓ Carpeta 'static/vehiculos' creada/verificada")

# Copiar todas las imágenes desde Downloads
if os.path.exists(ORIGEN_IMAGENES):
    # Copiar cada subcarpeta (koleos, camry, etc.)
    for carpeta in os.listdir(ORIGEN_IMAGENES):
        origen = os.path.join(ORIGEN_IMAGENES, carpeta)
        destino = os.path.join(vehiculos_path, carpeta)
        
        if os.path.isdir(origen):
            # Copiar carpeta completa
            shutil.copytree(origen, destino, dirs_exist_ok=True)
            
            # Contar archivos copiados
            num_archivos = len([f for f in os.listdir(destino) if os.path.isfile(os.path.join(destino, f))])
            print(f"✓ Copiadas {num_archivos} imágenes de '{carpeta}'")
    
    print(f"\n✅ ¡Todas las imágenes copiadas exitosamente!")
    print(f"📁 Ubicación: {vehiculos_path}")
else:
    print(f"❌ No se encontró la carpeta origen: {ORIGEN_IMAGENES}")
    print("   Verifica que exista la carpeta C:\\Users\\valer\\Downloads\\vehiculos")

# Listar archivos copiados
print("\n📋 Estructura de archivos en static/vehiculos/:")
for root, dirs, files in os.walk(vehiculos_path):
    nivel = root.replace(vehiculos_path, '').count(os.sep)
    indent = ' ' * 2 * nivel
    print(f"{indent}{os.path.basename(root)}/")
    sub_indent = ' ' * 2 * (nivel + 1)
    for file in files:
        print(f"{sub_indent}{file}")
