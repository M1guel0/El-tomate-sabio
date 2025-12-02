pipeline {
    agent any 

    // Aquí se definen las variables y las credenciales de forma segura
    environment {
        // Variables de Docker Compose
        SERVICE_NAME = 'pomodoroweb' 
        DOCKER_COMPOSE_DIR = 'Frontend' 
        
        // Credenciales de Codecov (ID que configuraste en Jenkins)
        CODECOV_TOKEN = credentials('codecov-token')
    }

    stages {
        // 1. Clonar el Código (Implícito en Pipeline desde SCM, pero explícito aquí)
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm 
            }
        }

        // 2. Pruebas y Cobertura (Codecov)
        stage('Test & Coverage') {
            agent {
                // Usamos un contenedor Node.js para ejecutar los tests
                docker { 
                    image 'node:16-alpine' 
                    // Montamos el workspace de Jenkins como /app dentro del contenedor
                    args "-v $PWD:/app -w /app" 
                }
            }
            steps {
                echo 'Instalando dependencias de prueba (Jest)...'
                // Instala Jest (basado en el package.json)
                sh 'npm install' 
                
                echo 'Ejecutando pruebas y generando reporte de cobertura...'
                // Ejecuta la prueba con la bandera --coverage
                sh 'npm test' 
                
                // --- Subida a Codecov ---
                echo 'Subiendo reportes a Codecov...'
                // Descargar el uploader
                sh 'curl -Os https://uploader.codecov.io/latest/linux/codecov'
                sh 'chmod +x codecov'
                
                // Subir el reporte usando la variable de entorno segura
                sh './codecov -t $CODECOV_TOKEN'
            }
        }

        // 3. Construir la Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo 'Construyendo la imagen Docker...'
                // Navegamos al directorio Frontend para ejecutar docker build
                dir("${env.DOCKER_COMPOSE_DIR}") {
                    sh "docker build -t ${env.SERVICE_NAME}:latest ." 
                }
            }
        }
        
        // 4. Desplegar con Docker Compose
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Desplegando la aplicación con docker-compose...'
                // Ejecutamos docker-compose en la raíz
                // Usamos 'pomodoroweb' para evitar conflictos con el contenedor Jenkins
                sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
            }
        }

        // 5. Verificación Post-Despliegue
        stage('Post-Deployment Check') {
            steps {
                echo 'Verificando que el servicio esté corriendo en el puerto 8082...'
                sh "docker ps | grep ${env.SERVICE_NAME}" 
            }
        }
    }
}