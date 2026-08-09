#!/usr/bin/env python
"""Quick-launch the demo server. Usage: python start.py [port]"""
import os, sys, subprocess
PORT = sys.argv[1] if len(sys.argv) > 1 else '8082'
ROOT = os.path.dirname(os.path.abspath(__file__))
print(f'Starting ACTIF demo on http://127.0.0.1:{PORT}/')
print('Open the URL on your phone (same Wi-Fi) to demo.')
subprocess.run([sys.executable, os.path.join(ROOT, 'server.py'), PORT], cwd=ROOT)