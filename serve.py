import http.server
import socketserver
import os
import webbrowser

PORT = 3000
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

os.chdir(DIRECTORY)

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Server running at http://localhost:{PORT}")
print("Press Ctrl+C to stop")

webbrowser.open(f"http://localhost:{PORT}")

httpd.serve_forever()
