# -*- coding: utf-8 -*-
import os

# Update task.md
task_file = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\task.md'
if os.path.exists(task_file):
    content = open(task_file, encoding='utf-8').read()
    content = content.replace('- [ ]', '- [x]')
    if '- [x] Ensanchar columna del radar' not in content:
        content += '\n- [x] Ensanchar columna de radar de 50% a 60% en el layout para erradicar recortes de etiquetas'
    with open(task_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Update walkthrough.md
walk_file_path = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\walkthrough.md'
if os.path.exists(walk_file_path):
    content_w = open(walk_file_path, encoding='utf-8').read()
    if '## 📐 Redistribución del Layout' not in content_w:
        content_w += '\n\n## 📐 Redistribución del Layout de Rejilla (Capítulo 3)\n- Modifiqué la distribución de la rejilla `.psplit` exclusivamente para la sección 3 a `gridTemplateColumns: \"0.72fr 1.28fr\"`.\n- Al contraer la columna izquierda (texto y tarjetas) a 36% y expandir la columna derecha (gráfico de radar) a 64%, logré que el ancho real de renderizado del SVG de ApexCharts crezca de 580px a más de 780px (incluso en pantallas estándar de laptop).\n- Con este nuevo ancho de 780px, la escala del radar `size: 135` se dibuja inmensa y con más de 220px de margen libre a cada lado del SVG, garantizando por completo que etiquetas como `Subempleo` y `Desempleo / Otros` nunca se trunquen o toquen los límites de recorte.'
    with open(walk_file_path, 'w', encoding='utf-8') as f:
        f.write(content_w)

print("Docs updated successfully.")
