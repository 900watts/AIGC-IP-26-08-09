"""
ACTIF 莞仔 demo server:
- Serves static files from the project root
- Proxies /api/ollama → http://localhost:11434/api/chat (bypasses CORS)
- Streams Ollama responses back to the browser

Run:  python server.py [port]
"""
import http.server
import socketserver
import urllib.request
import urllib.error
import json
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8082
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        # Permissive CORS for the demo (same-origin in practice)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/ollama':
            return self.proxy_ollama()
        self.send_error(404)

    def do_GET(self):
        if self.path == '/api/ollama/health':
            try:
                with urllib.request.urlopen('http://localhost:11434/api/tags', timeout=2) as r:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(r.read())
            except Exception as e:
                self.send_response(503)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': False, 'error': str(e)}).encode('utf-8'))
            return
        return super().do_GET()

    def proxy_ollama(self):
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length) if length > 0 else b'{}'
        try:
            payload = json.loads(body.decode('utf-8'))
        except Exception:
            payload = {}

        req = urllib.request.Request(
            'http://localhost:11434/api/chat',
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        self.send_response(200)
        self.send_header('Content-Type', 'application/x-ndjson; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                for line in resp:
                    if not line:
                        continue
                    self.wfile.write(line)
                    self.wfile.flush()
        except urllib.error.URLError as e:
            err = json.dumps({'error': f'ollama unreachable: {e.reason}'}).encode('utf-8') + b'\n'
            self.wfile.write(err)
            self.wfile.flush()
        except Exception as e:
            err = json.dumps({'error': str(e)}).encode('utf-8') + b'\n'
            self.wfile.write(err)
            self.wfile.flush()


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    print(f'ACTIF demo server: http://127.0.0.1:{PORT}/')
    print(f'  static   : {ROOT}')
    print(f'  ollama   : http://localhost:11434/api/chat (via /api/ollama)')
    with ReusableTCPServer(('0.0.0.0', PORT), Handler) as httpd:
        httpd.serve_forever()