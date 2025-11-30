pipeline {
    agent any

    environment {
        // Aseguramos que el path incluya binarios comunes
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Jenkins descarga automáticamente el código de GitHub
                checkout scm
            }
        }

        stage('Construcción (Build)') {
            steps {
                script {
                    echo ' Construyendo la imagen de Docker...'
                    // Usamos el docker-compose que ya tienes configurado
                    sh 'docker-compose build pomodoroweb'
                }
            }
        }

        stage('Despliegue (Deploy)') {
            steps {
                script {
                    echo ' Deteniendo y eliminando contenedores antiguos...'
                    // Detener y eliminar el servicio 'pomodoroweb' si existe
                    // Usamos || true para que el pipeline no falle si el contenedor no existe
                    sh 'docker compose stop pomodoroweb || true' 
                    sh 'docker compose rm -f pomodoroweb || true' 
                    
                    echo ' Desplegando el nuevo contenedor...'
                    // Levanta el nuevo contenedor
                    sh 'docker compose up -d pomodoroweb'
                }
            }
        }
    }
    
    post {
        success {
            echo ' ¡Despliegue exitoso!'
        }
        failure {
            echo ' Algo salió mal en el pipeline.'
        }
    }
}