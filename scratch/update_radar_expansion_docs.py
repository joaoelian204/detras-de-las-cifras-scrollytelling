# -*- coding: utf-8 -*-
import os

# Update task.md
task_file = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\task.md'
if os.path.exists(task_file):
    content = open(task_file, encoding='utf-8').read()
    content = content.replace('- [ ]', '- [x]')
    if '- [x] Expandir radar al máximo' not in content:
        content += '\n- [x] Expandir radar al máximo aumentando dimensiones y recortando textos para la Casa Abierta'
    with open(task_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Update walkthrough.md
walk_file_path = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\walkthrough.md'
if os.path.exists(walk_file_path):
    content_w = open(walk_file_path, encoding='utf-8').read()
    if '## 🕸️ Máxima Expansión' not in content_w:
        content_w += '\n\n## 🕸️ Máxima Expansión del Radar para Casa Abierta (Capítulo 3)\n- Incrementé el tamaño del gráfico de radar a `size: 150` para que rellene todo el espacio visual de la tarjeta de detalle, logrando un impacto de infografía premium idéntico al de las referencias.\n- Agrandé la caja contenedora `.cwrap` a `650px` de ancho máximo y `440px` de altura, y elevé la altura del gráfico ApexCharts a `410px`.\n- Acorté el texto de los nombres de los ejes removiendo el símbolo `(%)` (ej. `Empleo Pleno` en vez de `Empleo Pleno (%)`). Esto acortó significativamente la longitud de las cadenas horizontales, eliminando por completo cualquier recorte por los bordes izquierdo/derecho del lienzo SVG.'
    with open(walk_file_path, 'w', encoding='utf-8') as f:
        f.write(content_w)

print("Docs updated successfully.")
