pipeline {
    agent any 

    environment {
        SERVICE_NAME = 'pomodoroweb' 
        DOCKER_COMPOSE_DIR = 'Frontend'
        // Jalamos la credencial que guardamos en Jenkins
        CODECOV_TOKEN = credentials('codecov-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm 
            }
        }

//  ETAPA: Pruebas y Cobertura (Codecov)
        stage('Test & Coverage') {
            agent {
                // Usamos una imagen de Node.js para tener npm y jest disponibles
                docker { 
                    image 'node:16-alpine' 
                    // Montamos el directorio de trabajo actual. 
                    // Nota: $PWD en Jenkins es /var/jenkins_home/workspace/tu_job/
                    args "-v $PWD:/app -w /app" 
                }
            }
            steps { // <--- El bloque 'steps' es el contenedor para todo el trabajo
                echo 'Instalando dependencias de prueba...'
                // Las instrucciones 'sh' o 'script' van aquí
                sh 'npm install' 
                
                // Usamos un bloque script para agrupar los pasos de prueba y codecov
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        echo 'Ejecutando pruebas y generando reporte de cobertura...'
                        sh 'npm test' 
                        
                        echo 'Subiendo reportes a Codecov...'
                        // Instala el uploader de Codecov
                        sh 'curl -Os https://uploader.codecov.io/latest/linux/codecov'
                        sh 'chmod +x codecov'
                        
                        // Sube el reporte
                        sh './codecov -t $CODECOV_TOKEN'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // ... tu código existente ...
                script {
                     dir("${env.DOCKER_COMPOSE_DIR}") {
                        sh "docker build -t ${env.SERVICE_NAME}:latest ."
                     }
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        // Recuerda usar el nombre específico para evitar conflictos
                        sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
                    }
                }
            }
        }
    }
}