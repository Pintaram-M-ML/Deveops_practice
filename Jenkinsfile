pipeline {
    agent any

    environment {
        DOCKER_IMAGE_USER_SERVICE = "pintaram369/user-service"
        DOCKER_IMAGE_PRODUCT_SERVICE = "pintaram369/product-service"
        DOCKER_IMAGE_ORDER_SERVICE = "pintaram369/order-service"
        DOCKER_IMAGE_FRONTEND = "pintaram369/frontend"
        DOCKER_TAG   = "${BUILD_NUMBER}"
        REGISTRY_CREDENTIALS = "dockerhub-credentials-id"
        KUBE_CONTEXT = "minikube"
        HELM_RELEASE = "myapp"
        HELM_CHART_PATH = "./helm-chart"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                """
            }
        }

        stage('Login to Docker Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${REGISTRY_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }

        stage('Helm Upgrade / Deploy') {
            steps {
                sh """
                helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
                --set image.repository=${DOCKER_IMAGE} \
                --set image.tag=${DOCKER_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "Deployment Successful 🚀"
        }
        failure {
            echo "Pipeline Failed ❌"
        }
    }
}
