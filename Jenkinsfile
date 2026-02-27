pipeline {
    agent any

    environment {
        DOCKER_IMAGE_USER_SERVICE = "pintaram369/user-service"
        DOCKER_IMAGE_PRODUCT_SERVICE = "pintaram369/product-service"
        DOCKER_IMAGE_ORDER_SERVICE = "pintaram369/order-service"
        DOCKER_IMAGE_FRONTEND = "pintaram369/frontend"
        DOCKER_TAG = "latest"
        REGISTRY_CREDENTIALS = "dockerhub-credentials-id"
        KUBE_CONTEXT = "kind-kind"
        HELM_RELEASE = "myrelease"
        HELM_NAMESPACE = "micro"
        HELM_CHART_PATH = "mychart"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Pintaram-M-ML/Deveops_practice.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE_USER_SERVICE}:${DOCKER_TAG} ./user-service
                    docker build -t ${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG} ./product-service
                    docker build -t ${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG} ./order-service
                    docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ./frontend
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

        stage('Push Docker Images') {
            steps {
                sh """
                    docker push ${DOCKER_IMAGE_USER_SERVICE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                """
            }
        }

        stage('Helm Upgrade / Deploy') {
            steps {
                sh """
                    helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
                        --namespace ${HELM_NAMESPACE} \
                        --create-namespace \
                        --set userService.image.tag=${DOCKER_TAG} \
                        --set productService.image.tag=${DOCKER_TAG} \
                        --set orderService.image.tag=${DOCKER_TAG} \
                        --set frontend.image.tag=${DOCKER_TAG} \
                        --kube-context ${KUBE_CONTEXT}
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
