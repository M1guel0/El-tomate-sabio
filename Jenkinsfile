def runTestsWithDocker(projectDir, codecovToken) {
    // Definimos el contenedor donde se ejecutarán los pasos
    docker.image('node:16-alpine').inside("-v $PWD:/app -w /app") {
        
        // 1. Instalar dependencias (se ejecuta en /app)
        sh 'echo "Instalando dependencias de prueba (Jest)..."'
        sh 'npm install' 
        
        // 2. Ejecutar pruebas
        sh 'echo "Ejecutando pruebas y generando reporte de cobertura..."'
        sh 'npm test' 
        
        // 3. Subida a Codecov
        sh 'echo "Subiendo reportes a Codecov..."'
        sh 'curl -Os https://uploader.codecov.io/latest/linux/codecov'
        sh 'chmod +x codecov'
        
        // Usamos el token de Codecov que pasamos como argumento
        sh "./codecov -t ${codecovToken}"
    }
}

pipeline {
    agent any 

    // Aquí se definen las variables y las credenciales de forma segura
    environment {
        SERVICE_NAME = 'pomodoroweb' 
        DOCKER_COMPOSE_DIR = 'Frontend' 
        
        // Credenciales de Codecov (ID que configuraste en Jenkins)
        CODECOV_TOKEN = credentials('codecov-token')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm 
            }
        }

        // 2. Pruebas y Cobertura (Ahora usando la función)
        stage('Test & Coverage') {
            steps {
                script {
                    // Llamamos a la función que usa el contenedor Docker
                    runTestsWithDocker(env.DOCKER_COMPOSE_DIR, env.CODECOV_TOKEN)
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
                sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
            }
        }
    }
}