#!/usr/bin/env python3
"""CORS-enabled HTTP server for serving bookmarklet scripts locally.

Usage: python3 skill/scripts/serve.py [port]
Default port: 9876
"""
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class CORSHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, *args):
        pass


port = int(sys.argv[1]) if len(sys.argv) > 1 else 9876
os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"Serving scripts on http://127.0.0.1:{port}")
HTTPServer(("127.0.0.1", port), CORSHandler).serve_forever()
