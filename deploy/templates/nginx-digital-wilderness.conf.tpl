# Host Nginx reverse-proxy for Digital Wilderness (container on 127.0.0.1)
# Sed placeholders below: DOMAIN and APP_PORT tokens only appear in active directives.
# Separate from portfolio's /etc/nginx/sites-available/portfolio — do not merge.

server {
    listen 80;
    listen [::]:80;
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
