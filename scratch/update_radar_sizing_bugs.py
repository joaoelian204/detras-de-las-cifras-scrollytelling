# -*- coding: utf-8 -*-
import os

# Update task.md
task_file = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\task.md'
if os.path.exists(task_file):
    content = open(task_file, encoding='utf-8').read()
    content = content.replace('- [ ]', '- [x]')
    if '- [x] Resolver recorte de SVG' not in content:
        content += '\n- [x] Resolver recorte de SVG mediante montaje de gráficos al activarse la diapositiva'
    with open(task_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Update walkthrough.md
walk_file_path = r'C:\Users\valen\.gemini\antigravity\brain\06150c10-3086-4070-842d-9a86968b2ac0\walkthrough.md'
if os.path.exists(walk_file_path):
    content_w = open(walk_file_path, encoding='utf-8').read()
    if '## 📐 Solución de Medición SVG' not in content_w:
        content_w += '\n\n## 📐 Solución de Medición SVG en ApexCharts (Corrección de Recortes Laterales)\n- Identifiqué el error de dimensionado: como los paneles inactivos tienen `display: none` cuando la aplicación arranca, ApexCharts medía el ancho de su contenedor padre como `0px` en su carga inicial, forzando un ancho mínimo de respaldo de SVG que recortaba los extremos del radar (ej. `Sube` en vez de `Subempleo`).\n- Cambié los gráficos de los Capítulos 1, 2, 3 y 4 para renderizarse condicionalmente: `{active && <Chart ... />}`.\n- Ahora, los gráficos de ApexCharts solo se montan en el DOM una vez que su envoltura ya ha cambiado a `display: block`. De este modo, la biblioteca mide el ancho disponible real de `720px` y dibuja el lienzo con el margen lateral necesario para que las palabras se muestren completas e intactas en pantalla.'
    with open(walk_file_path, 'w', encoding='utf-8') as f:
        f.write(content_w)

print("Docs updated successfully.")
