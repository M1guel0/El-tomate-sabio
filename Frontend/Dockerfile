#Usar una imagen de oficial de Ngix 
FROM nginx:alpine
#copiar los archivos del frontend dentro del contenedor 
COPY . /usr/share/nginx/html
# exponer el puerto por defecto de nginx
EXPOSE 80
#comando por defecto. 
CMD ["nginx", "-g", "daemon off;"]
