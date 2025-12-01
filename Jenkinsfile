pipeline {
    agent any 
    
    // Se definen las variables de entorno para usar en el pipeline
    environment {
        // Nombre del servicio web definido en docker-compose.yml
        SERVICE_NAME = 'pomodoroweb' 
        // Ubicación de la carpeta donde está el docker-compose.yml
        DOCKER_COMPOSE_DIR = 'Frontend'
    }

    stages {
        // 1. Checkout (Clonar el Código)
        stage('Checkout') {
            steps {
                // Esta instrucción es a menudo implícita cuando el Job es un "Pipeline" 
                // configurado con SCM (como tu GitHub), pero es bueno tener el paso.
                // En un pipeline de Jenkinsfile desde SCM, esta etapa normalmente solo usa
                // 'checkout scm' para obtener el código.
                echo 'Clonando el repositorio desde GitHub...'
                // Si la configuración del job en Jenkins usa SCM (como tu GitHub project),
                // esta línea se encarga de clonar el código en el workspace de Jenkins.
                checkout scm 
            }
        }

        // 2. Construir la Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo 'Construyendo la imagen Docker...'
                script {
<<<<<<< HEAD
                    echo '🏗️ Construyendo la imagen de Docker...'
                    // Usamos el docker-compose que ya tienes configurado
                    sh 'docker compose build pomodoroweb'
=======
                    // Navegar al directorio donde se encuentra el Dockerfile
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        // Construir la imagen basada en el Dockerfile de la carpeta 'Frontend'
                        // y nombrarla para que docker-compose la reconozca.
                        sh "docker build -t ${env.SERVICE_NAME}:latest ." 
                    }
                }
            }
        }
        
        // 3. Desplegar con Docker Compose
        stage('Deploy with Docker Compose') {
            steps {
                echo 'Desplegando la aplicación con docker-compose...'
                script {
                    // Navegar al directorio donde se encuentra el docker-compose.yml
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                        // Desplegar (o actualizar) los servicios.
                        // --build: Opcional, pero asegura que cualquier cambio en Dockerfile se refleje.
                        // -d: Modo detached (en segundo plano).
                        // --up-to-date: Evita reconstruir si no hay cambios.
                        sh 'docker-compose up -d --build --force-recreate' 
                    }
>>>>>>> 1306cc67a63470e7ca23cc38fb3d1bf5ee2ea94b
                }
            }
        }

<<<<<<< HEAD
        stage('Despliegue (Deploy)') {
            steps {
                script {
                    echo '🛑 Deteniendo y eliminando todo el entorno Compose...'
                    // docker compose down detiene y elimina (stop and rm) todos los servicios
                    // -v elimina volúmenes (si los hubiera, limpiando por completo)
                    sh 'docker compose down -v || true' 
                    
                    echo '⏳ Esperando 2 segundos para liberar el puerto 8082...'
                    sh 'sleep 2' 
                    
                    echo '🚀 Desplegando el nuevo contenedor...'
                    // Usamos up con --build para asegurarnos de que use la imagen recién construida.
                    sh 'docker compose up -d --build pomodoroweb'
                }
            }
        }
    }
    
    post {
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo ' Algo salió mal en el pipeline.'
        }
=======
        // 4. Verificación Post-Despliegue (Opcional, pero recomendado)
        stage('Post-Deployment Check') {
            steps {
                echo 'Verificando que el servicio esté corriendo en el puerto 8082...'
                // Verificar que el contenedor esté arriba. Puedes refinar esto con una
                // llamada CURL al puerto 8082 si tienes CURL instalado en el agente.
                sh "docker ps | grep ${env.SERVICE_NAME}" 
            }
        }
>>>>>>> 1306cc67a63470e7ca23cc38fb3d1bf5ee2ea94b
    }
}