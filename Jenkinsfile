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
                    dir("${env.DOCKER_COMPOSE_DIR}") {
                    // **CAMBIAR ESTA LÍNEA**
                    sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
                    // Al añadir 'pomodoroweb', solo intentará recrear ese servicio,
                    // ignorando el servicio 'jenkins' y evitando más conflictos.
                }
            }
        }
    }

        // 4. Verificación Post-Despliegue (Opcional, pero recomendado)
        stage('Post-Deployment Check') {
            steps {
                echo 'Verificando que el servicio esté corriendo en el puerto 8082...'
                // Verificar que el contenedor esté arriba. Puedes refinar esto con una
                // llamada CURL al puerto 8082 si tienes CURL instalado en el agente.
                sh "docker ps | grep ${env.SERVICE_NAME}" 
            }
        }
    }
}  