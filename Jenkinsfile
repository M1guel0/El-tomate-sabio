pipeline {
    agent any 

    environment {
        SERVICE_NAME = 'pomodoroweb' 
        DOCKER_COMPOSE_DIR = 'Frontend' 
        // Credenciales de Codecov (ID que configuraste en Jenkins)
        CODECOV_TOKEN = credentials('codecov-token')
        // La variable WORKSPACE ya no es necesaria, usaremos la nativa $WORKSPACE.
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio desde GitHub...'
                checkout scm 
            }
        }

        // 2. Pruebas y Cobertura (Codecov) - SOLUCIÓN ROBUSTA
        stage('Test & Coverage') {
            steps {
                script {
                    echo 'Ejecutando tests en contenedor Node.js (vía docker run con volumes-from)...'
                    
                    // Capturamos el ID del contenedor Jenkins actual.
                    def jenkinsContainerId = sh(returnStdout: true, script: 'echo $HOSTNAME').trim()
                    
                    // Definimos los comandos de prueba en una variable
                    def testCommands = """
                        set -e  # Detiene el script si cualquier comando falla
                        
                        echo "Contenido de la carpeta de trabajo (\$PWD):"
                        ls -a # Muestra los archivos para confirmar que package.json está ahí
                        
                        # 1. Ejecutar en el directorio /app (que es el workspace de Jenkins)
                        npm install
                        
                        # 2. Ejecutar pruebas (genera el reporte de cobertura)
                        npm test 
                        
                        # 3. Subida a Codecov
                        curl -Os https://uploader.codecov.io/latest/linux/codecov
                        chmod +x codecov
                        
                        # Subir el reporte usando el token
                        ./codecov -t ${env.CODECOV_TOKEN}
                    """
                    
                    // EJECUCIÓN CRÍTICA:
                    // --volumes-from ${jenkinsContainerId}: Monta el workspace de Jenkins en el nuevo contenedor.
                    // -w $WORKSPACE: Establece el directorio de trabajo al mismo que usa Jenkins (/var/jenkins_home/workspace/Jenkins1).
                    // Esto resuelve el error "ENOENT: no such file or directory" 
                    sh "docker run --rm --volumes-from ${jenkinsContainerId} -w \$WORKSPACE node:16-alpine /bin/sh -c '${testCommands}'"
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
                // Ejecutamos docker-compose en la raíz
                sh 'docker-compose up -d --build --force-recreate pomodoroweb' 
            }
        }

        // 5. Verificación Post-Despliegue
        stage('Post-Deployment Check') {
            steps {
                echo 'Verificando que el servicio esté corriendo en el puerto 8082...'
                sh "docker ps | grep ${env.SERVICE_NAME}" 
            }
        }
    }
}