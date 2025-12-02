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

        stage('Test & Coverage') {
            agent {
                Docker { 
                    image 'node:16-alpine' 
                    args "-v $PWD:/app -w /app" // Monta la raíz del proyecto como /app
                }
            }
            steps {
                sh 'npm install' // Se ejecuta en /app (raíz)
                sh 'npm test'    // Se ejecuta en /app (raíz)
                
                // Subida de Codecov
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