pipeline {
    agent any 

    // Definición de las herramientas necesarias
    
    // Se definen las variables de entorno para usar en el pipeline
    environment {
        // Nombre del servicio web definido en docker-compose.yml
        SERVICE_NAME = 'pomodoroweb' 
        // Ubicación de la carpeta donde está el docker-compose.yml
        DOCKER_COMPOSE_DIR = 'Frontend'
        CODECOV_TOKEN = credentials('codecov-token') // Ejemplo de uso de credenciales
    }

    stages {
        // 1. Checkout (Clonar el Código)
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm 
            }
        }

        // 2. Instalar dependencias y ejecutar pruebas con cobertura
        stage('Run Tests with Coverage') {
            steps {
                echo 'Instalando dependencias y ejecutando pruebas...'
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        // Instalar dependencias (si usas npm)
                        sh 'npm install'
                        
                        // Ejecutar pruebas con Jest y generar reporte de cobertura
                        sh 'npx jest --coverage'
                        
                        // Opcional: Ver contenido del reporte generado
                        sh 'ls -la coverage/'
                    }
                }
            }
        }

        // 3. Subir reporte a Codecov
        stage('Upload to Codecov') {
            steps {
                echo 'Subiendo reporte de cobertura a Codecov...'
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        // Usar el token de Codecov configurado en Jenkins
                        // El reporte se encuentra en coverage/lcov.info
                        sh """
                            curl -Os https://uploader.codecov.io/latest/linux/codecov
                            chmod +x codecov
                            ./codecov -t \${CODECOV_TOKEN} -f coverage/lcov.info
                        """
                    }
                }
            }
        }

        // 4. Construir la Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo 'Construyendo la imagen Docker...'
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        sh "docker build -t ${env.SERVICE_NAME}:latest ." 
                    }
                }
            }
        }
        
        // 5. Desplegar con Docker Compose
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Desplegando la aplicación con docker-compose...'
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
                    }
                }
            }
        }

        // 6. Verificación Post-Despliegue (Opcional, pero recomendado)
        stage('Post-Deployment Check') {
            steps {
                echo 'Verificando que el servicio esté corriendo en el puerto 8082...'
                sh "docker ps | grep ${env.SERVICE_NAME}" 
            }
        }
    }
}