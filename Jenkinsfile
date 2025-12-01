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
                    sh 'docker compose build pomodoroweb'
                }
            }
        }

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
    
    post {
        success {
            echo ' ¡Despliegue exitoso!'
        }
        failure {
            echo ' Algo salió mal en el pipeline.'
        }
    }
}