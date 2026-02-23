
import re

file_path = '/Volumes/FlexibleWorkplace/side-pr/ztools.site/src/features/dap-heo/script.js'

with open(file_path, 'r') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # Remove comments (simple approximation)
    line = re.sub(r'//.*', '', line)
    
    for char in line:
        if char in '{[(':
            stack.append((char, i + 1))
        elif char in '}])':
            if not stack:
                print(f"Error: Unexpected '{char}' at line {i + 1}")
                exit(1)
            last, line_num = stack.pop()
            expected = {'{': '}', '[': ']', '(': ')'}[last]
            if char != expected:
                print(f"Error: Mismatched '{char}' at line {i + 1}. Expected '{expected}' to close '{last}' from line {line_num}")
                exit(1)

if stack:
    print("Error: Unclosed blocks at EOF:")
    for char, line_num in stack:
        print(f"  '{char}' from line {line_num}")
else:
    print("Braces are balanced.")
