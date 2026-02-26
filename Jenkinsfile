pipeline {
    agent any

    environment {
        DOCKER_IMAGE_USER_SERVICE = "pintaram369/user-service"
        DOCKER_IMAGE_PRODUCT_SERVICE = "pintaram369/product-service"
        DOCKER_IMAGE_ORDER_SERVICE = "pintaram369/order-service"
        DOCKER_IMAGE_FRONTEND = "pintaram369/frontend"
        DOCKER_TAG   = "${BUILD_NUMBER}"
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

        stage('Build Docker Image') {
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

        stage('Push Docker Image') {
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
                    helm upgrade --install myrelease mychart \
                        --namespace micro \
                        --create-namespace \
                        --set userService.image=${DOCKER_IMAGE_USER_SERVICE:${DOCKER_TAG} \
                        --set productService.image=${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG} \
                        --set orderService.image=${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG} \
                        --set frontend.image=${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} \
                        --kube-context kind-kubeadm-kind

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
        
