import glob
import os

cleanup_fixes = {
    "Technology Solutionsnology Solutions": "Technology Solutions",
    "Marketing &amp; Brand & Creative Solutions": "Marketing &amp; Brand",
    "Finance Solutions Solutions": "Finance Solutions",
    "Technology Solutions Solutions": "Technology Solutions",
    "Strategy & Research & Research": "Strategy & Research",
    "HR Management Management": "HR Management",
    "Marketing & Brand & Creative Solutions": "Marketing & Brand"
}

replacements = {
    "Strategy & Research": "Business Labs - Strategy & Research",
    "Strategy &amp; Research": "Business Labs - Strategy &amp; Research",
    "Technology Solutions": "Evolve - Technology Solutions",
    "Marketing & Brand": "Xplore - Marketing & Brand",
    "Marketing &amp; Brand": "Xplore - Marketing &amp; Brand",
    "HR Management": "Elevate - HR Management",
    "Finance Solutions": "Ensure - Finance Solutions"
}

html_files = glob.glob("*.html")
print(f"Found {len(html_files)} HTML files to process.")

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # First apply cleanup fixes to ensure cleanly formatted text
    for bad, good in cleanup_fixes.items():
        if bad in content:
            print(f"Cleaning up '{bad}' in {filepath}")
            content = content.replace(bad, good)

    # Revert if already applied to prevent double application
    for old, new in replacements.items():
        content = content.replace(new, old)

    # Apply new brands
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Applied brand prefixes to {len(html_files)} files.")
