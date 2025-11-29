
import re

file_path = r'd:\Jeu-mobile-adrien\js\ui\UIManager.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix HTML tags with spaces
content = re.sub(r'<\s+div', '<div', content)
content = re.sub(r'<\s+/div', '</div', content)
content = re.sub(r'<\s+p', '<p', content)
content = re.sub(r'<\s+/p', '</p', content)
content = re.sub(r'</\s+div', '</div>', content) # Handle </ div >
content = re.sub(r'</\s+p', '</p>', content)     # Handle </ p >
content = re.sub(r'div\s+>', 'div>', content)     # Handle <div ... >
content = re.sub(r'p\s+>', 'p>', content)         # Handle <p ... >

# Fix template literals spaces
content = re.sub(r'\${\s+', '${', content)
content = re.sub(r'\s+}', '}', content)

# Fix CSS units and keyframes
content = re.sub(r'}\s+px', '}px', content)
content = re.sub(r'0\s+%', '0%', content)
content = re.sub(r'80\s+%', '80%', content)
content = re.sub(r'100\s+%', '100%', content)

# Specific fix for showDamageNumber
content = content.replace('${x+20} px', '${x+20}px')
content = content.replace('${y} px', '${y}px')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("UIManager.js sanitized successfully.")
