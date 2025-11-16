#Usar una imagen de oficial de Ngix 
FROM nginx:alpine
#copiar los archivos de la aplicación al directorio. 
COPY . /usr/share/nginx/html 
# exponer el puerto 8080
EXPOSE 80
#comando por defecto. 
CMD [ "nginx", "-g", "daemon off"  ]

