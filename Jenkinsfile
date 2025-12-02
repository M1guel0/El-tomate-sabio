pipeline {
    agent any 

    environment {
        SERVICE_NAME = 'pomodoroweb' 
        DOCKER_COMPOSE_DIR = 'Frontend' 
        // Credenciales de Codecov (ID que configuraste en Jenkins)
        CODECOV_TOKEN = credentials('codecov-token')
        // Variable para la ruta del workspace, esencial para montar volúmenes
        WORKSPACE = pwd() 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm 
            }
        }

        // 2. Pruebas y Cobertura (Codecov) - SOLUCIÓN ROBUSTA
        stage('Test & Coverage') {
            steps {
                script {
                    echo 'Ejecutando tests en contenedor Node.js (vía docker run)...'
                    
                    // Definimos los comandos de prueba en una variable
                    def testCommands = """
                        set -e  # Detiene el script si cualquier comando falla
                        
                        # 1. Ejecutar en el directorio /app (que es el workspace de Jenkins)
                        npm install
                        
                        # 2. Ejecutar pruebas (genera el reporte de cobertura)
                        npm test 
                        
                        # 3. Subida a Codecov
                        curl -Os https://uploader.codecov.io/latest/linux/codecov
                        chmod +x codecov
                        
                        # Subir el reporte usando el token
                        ./codecov -t ${env.CODECOV_TOKEN}
                    """
                    
                    // Ejecutamos docker run:
                    // --rm: elimina el contenedor al finalizar
                    // -v $WORKSPACE:/app: monta la carpeta actual de Jenkins en /app
                    // -w /app: establece /app como directorio de trabajo
                    // node:16-alpine: la imagen que necesitamos para npm/Jest
                    // /bin/sh -c '...': ejecuta nuestros comandos
                    sh "docker run --rm -v ${env.WORKSPACE}:/app -w /app node:16-alpine /bin/sh -c '${testCommands}'"
                }
            }
        }

        // 3. Construir la Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo 'Construyendo la imagen Docker...'
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