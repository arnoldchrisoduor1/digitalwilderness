# Serve the pre-built static export with Nginx
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
