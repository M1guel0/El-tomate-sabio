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

        // NUEVA ETAPA: Pruebas y Cobertura
        stage('Test & Coverage') {
            agent {
                docker { 
                    // Usamos una imagen de Node temporal solo para probar el JS
                    image 'node:16-alpine' 
                    args '-u root'
                }
            }
            steps {
                echo 'Ejecutando pruebas...'
                sh 'npm install'
                sh 'npm test' 
                        
                        // Una vez generados los reportes de cobertura, se suben:
                echo 'Subiendo reportes a Codecov...'
                        // Descargar el uploader de Codecov
                sh 'curl -Os https://uploader.codecov.io/latest/linux/codecov'
                sh 'chmod +x codecov'
                sh './codecov -t $CODECOV_TOKEN'
                    
                
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