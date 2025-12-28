import os
import json

def scan_projects():
    # Configuration
    projects_dir = 'project'
    output_file = 'projects.json'
    
    # Check if project directory exists
    if not os.path.exists(projects_dir):
        print(f"Directory '{projects_dir}' not found.")
        return

    projects_list = []

    # Iterate through items in the project directory
    for item in os.listdir(projects_dir):
        item_path = os.path.join(projects_dir, item)
        
        # Check if it is a directory
        if os.path.isdir(item_path):
            # Check if index.html exists in this directory
            if 'index.html' in os.listdir(item_path):
                # Create project entry
                # Path format: project/FolderName/index.html
                # We use forward slashes for web paths regardless of OS
                web_path = f"{projects_dir}/{item}/index.html"
                
                project_entry = {
                    "name": item,
                    "path": web_path
                }
                projects_list.append(project_entry)
                print(f"Found project: {item}")

    # Write to JSON file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(projects_list, f, indent=4, ensure_ascii=False)
        print(f"Successfully generated {output_file} with {len(projects_list)} projects.")
    except Exception as e:
        print(f"Error writing to {output_file}: {e}")

if __name__ == "__main__":
    scan_projects()
