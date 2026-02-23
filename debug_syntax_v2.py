
import re

file_path = '/Volumes/FlexibleWorkplace/side-pr/ztools.site/src/features/dap-heo/script.js'

with open(file_path, 'r') as f:
    lines = f.readlines()

stack = []
debug_log = []

for i, line in enumerate(lines):
    # Remove comments (simple approximation)
    # We must handle strings too technically, but usually simple regex works for structural debug
    # Let's simple-strip // comments but be careful with http://
    line_content = line.split('//')[0] 
    
    for char in line_content:
        if char in '{[(':
            stack.append((char, i + 1))
        elif char in '}])':
            if not stack:
                print(f"Error: Unexpected '{char}' at line {i + 1}")
                exit(1)
            last, line_num = stack.pop()
            
            # Store the match for the last few closures
            if i > 1080: 
                debug_log.append(f"Line {i+1}: '{char}' closes '{last}' from Line {line_num}")

            expected = {'{': '}', '[': ']', '(': ')'}[last]
            if char != expected:
                print("Recent closures near EOF:")
                for log in debug_log[-10:]:
                    print(log)
                print(f"Error: Mismatched '{char}' at line {i + 1}. Expected '{expected}' to close '{last}' from line {line_num}")
                exit(1)

print("Recent closures near EOF:")
for log in debug_log[-10:]:
    print(log)

if stack:
    print("Error: Unclosed blocks at EOF:")
    for char, line_num in stack:
        print(f"  '{char}' from line {line_num}")
else:
    print("Braces are balanced.")
