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
                    echo 'Construye la imagen de Docker...'
                    // Usamos el docker-compose que ya tienes configurado
                    sh 'docker compose build pomodoroweb'
                }
            }
        }

        stage('Despliegue (Deploy)') {
            steps {
                script {
                    echo 'Desplegando la aplicación...'
                    // Levanta el contenedor en modo "detached" (-d)
                    // --force-recreate asegura que tome los cambios de la nueva imagen
                    sh 'docker compose up -d --force-recreate pomodoroweb'
                }
            }
        }
    }
    
    post {
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo 'Algo salió mal en el pipeline.'
        }
    }
}
