import os

files = [
    'd:/AI_FIRST_DNA/AI-First_testDNA/Frontend/src/Components/Project/CreateProjectModal.tsx',
    'd:/AI_FIRST_DNA/AI-First_testDNA/Frontend/src/Components/Project/ProjectsPage.tsx',
    'd:/AI_FIRST_DNA/AI-First_testDNA/Frontend/src/Components/Project/EditProjectModal.tsx'
]

for filepath in files:
    with open(filepath, 'rb') as f:
        data = f.read()
    print(f"{filepath}: {len(data)} bytes")
    # Check for NBSP (0xC2 0xA0) or BOM
    if b'\xc2\xa0' in data:
        print(f"  WARNING: Found NBSP in {filepath}")
        data = data.replace(b'\xc2\xa0', b' ')
        with open(filepath, 'wb') as f:
            f.write(data)
        print(f"  Fixed NBSP in {filepath}")
    if data.startswith(b'\xef\xbb\xbf'):
        print(f"  WARNING: Found UTF-8 BOM in {filepath}")
        data = data[3:]
        with open(filepath, 'wb') as f:
            f.write(data)
        print(f"  Removed BOM in {filepath}")
