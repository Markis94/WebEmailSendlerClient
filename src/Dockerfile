FROM nginx:latest AS ngi
COPY . /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80