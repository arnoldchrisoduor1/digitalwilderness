# Host Nginx reverse-proxy for Digital Wilderness (container on 127.0.0.1:APP_PORT)
# Placeholders: __DOMAIN__ __APP_PORT__
# Separate from portfolio's /etc/nginx/sites-available/portfolio — do not merge.

server {
    listen 80;
    listen [::]:80;
    # __DOMAIN__ may be space-separated hostnames
    server_name __DOMAIN__;

    location / {
        proxy_pass http://127.0.0.1:__APP_PORT__;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
