# -*- coding: utf-8 -*-
import os

# Update task.md
task_file = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\task.md'
if os.path.exists(task_file):
    content = open(task_file, encoding='utf-8').read()
    content = content.replace('- [ ]', '- [x]')
    if '- [x] Quitar el contenedor de tarjeta' not in content:
        content += '\n- [x] Quitar el contenedor de tarjeta del gráfico de radar y dejarlo libre y expandido al máximo'
    with open(task_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Update walkthrough.md
walk_file_path = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\walkthrough.md'
if os.path.exists(walk_file_path):
    content_w = open(walk_file_path, encoding='utf-8').read()
    if '## 🕸️ Liberación del Radar' not in content_w:
        content_w += '\n\n## 🕸️ Liberación del Radar (Remoción de Contenedor Encajonado)\n- Eliminé por completo el contenedor con clase `.cwrap` en el Capítulo 3.\n- Al quitar este cuadro con fondo grisáceo, bordes y padding que encajonaban el gráfico, permití que el radar flote libremente directamente sobre la sección.\n- Amplié el tamaño de renderizado del radar a `size: 160` y la altura del gráfico a `450px`, contenidos dentro de un contenedor transparente con `maxWidth: 720px`.\n- Esto dota a las etiquetas de texto de un espacio de margen enorme a la izquierda y derecha, resolviendo definitivamente cualquier recorte y logrando que el radar de la Casa Abierta luzca completamente libre, expandido y moderno.'
    with open(walk_file_path, 'w', encoding='utf-8') as f:
        f.write(content_w)

print("Docs updated successfully.")
